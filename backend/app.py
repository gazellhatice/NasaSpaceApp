from flask import Flask, jsonify, request
import requests, datetime as dt, os
from flask_cors import CORS
from dotenv import load_dotenv
from typing import List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge

load_dotenv()

app = Flask(__name__)
CORS(app) 

# ✅ AirNow key
AIRNOW_KEY = os.getenv("AIRNOW_KEY", "")
NASA_TOKEN = os.getenv("NASA_TOKEN", "")

# 🔹 CMR araması için sabitler
CMR_GRANULES_URL = "https://cmr.earthdata.nasa.gov/search/granules.json"
# TEMPO NO2 L2 V03 koleksiyonunun concept-id'si (ASDC / LARC_CLOUD)
TEMPO_NO2_L2_V03 = "C2930725014-LARC_CLOUD"   # NO2 L2 (V03, PROVISIONAL)

@app.route('/')
def home():
    return jsonify({"message": "NASA TEMPO Air Quality Project - Backend Running ✅"})

@app.route('/airnow', methods=['GET'])
def airnow():
    lat = request.args.get("lat", "40.7128")
    lon = request.args.get("lon", "-74.0060")
    distance = request.args.get("distance", "50")

    url = (
        "https://www.airnowapi.org/aq/observation/latLong/current/"
        f"?format=application/json&latitude={lat}&longitude={lon}"
        f"&distance={distance}&API_KEY={AIRNOW_KEY}"
    )

    try:
        r = requests.get(url, timeout=30)
        if not r.ok:
            return jsonify({"error": "AirNow verisi alınamadı", "status": r.status_code}), 502

        raw = r.json()

        # Normalize: tek kayıtta PM2.5, O3 vb. alanlar
        merged = {
            "location": {"lat": float(lat), "lon": float(lon)},
            "reportingArea": None,
            "stateCode": None,
            "observedAt": None,
            "aqi": {},     # {"PM2.5": 42, "O3": 31, ...}
            "category": {} # {"PM2.5": "Good", ...}
        }

        for item in raw:
            p = item.get("ParameterName")
            if not merged["reportingArea"]:
                merged["reportingArea"] = item.get("ReportingArea")
                merged["stateCode"] = item.get("StateCode")
                # DateObserved + HourObserved birleştirme:
                merged["observedAt"] = f'{item.get("DateObserved","").strip()} {item.get("HourObserved", "")}:00'
            if p:
                merged["aqi"][p] = item.get("AQI")
                cat = item.get("Category", {}).get("Name")
                if cat:
                    merged["category"][p] = cat

        return jsonify(merged), 200

    except Exception as ex:
        return jsonify({"error": "AirNow hata", "detail": str(ex)}), 500

@app.route('/tempo', methods=['GET'])
def tempo():
    lat = float(request.args.get("lat", "40.7128"))
    lon = float(request.args.get("lon", "-74.0060"))
    delta = float(request.args.get("delta", "0.2"))

    # 🔹 İsteğe bağlı tarih (YYYY-MM-DD formatında)
    date_str = request.args.get("date")
    if date_str:
        try:
            base = dt.datetime.fromisoformat(date_str)  # örn: 2024-05-01
        except Exception:
            return jsonify({"error": "Geçersiz tarih formatı. YYYY-MM-DD olmalı"}), 400
    else:
        base = dt.datetime.utcnow()

    # Günün başlangıç ve bitişi
    start = base.replace(hour=0, minute=0, second=0, microsecond=0).isoformat() + "Z"
    end   = base.replace(hour=23, minute=59, second=59, microsecond=0).isoformat() + "Z"

    bbox = f"{lon - delta},{lat - delta},{lon + delta},{lat + delta}"

    params = {
        "collection_concept_id": "C2930725014-LARC_CLOUD",  # TEMPO NO2 L2
        "bounding_box": bbox,
        "temporal": f"{start},{end}",
        "page_size": 5,
        "sort_key": "-start_date"
    }

    try:
        resp = requests.get(
            "https://cmr.earthdata.nasa.gov/search/granules.json",
            params=params,
            headers={"Accept": "application/json"},
            timeout=30
        )
        if not resp.ok:
            return jsonify({
                "error": "CMR isteği başarısız",
                "status": resp.status_code,
                "detail": resp.text[:300]
            }), 502

        feed = resp.json().get("feed", {})
        entries = feed.get("entry", [])
        granules = []
        for e in entries:
            links = [L.get("href") for L in e.get("links", []) if L.get("href")]
            granules.append({
                "id": e.get("id"),
                "title": e.get("title"),
                "time_start": e.get("time_start"),
                "time_end": e.get("time_end"),
                "links": links
            })

        return jsonify({
            "location": {"lat": lat, "lon": lon},
            "search_bbox": bbox,
            "temporal": {"start": start, "end": end},
            "granules_found": len(granules),
            "granules": granules
        }), 200

    except Exception as ex:
        return jsonify({"error": "TEMPO işlem hatası", "detail": str(ex)}), 500

@app.route('/combined', methods=['GET'])
def combined():
    lat = request.args.get("lat", "40.7128")
    lon = request.args.get("lon", "-74.0060")
    date = request.args.get("date")  # YYYY-MM-DD

    # 🔹 AirNow: tarih varsa historical, yoksa current
    if date:
    # AirNow historical için format: 2024-05-01T00-0000
        airnow_url = (
        "https://www.airnowapi.org/aq/observation/latLong/historical/"
        f"?format=application/json&latitude={lat}&longitude={lon}"
        f"&date={date}T00-0000&distance=50&API_KEY={AIRNOW_KEY}"
    )
    else:
        airnow_url = (
        "https://www.airnowapi.org/aq/observation/latLong/current/"
        f"?format=application/json&latitude={lat}&longitude={lon}"
        f"&distance=50&API_KEY={AIRNOW_KEY}"
    )


    airnow_data = None
    try:
        airnow_resp = requests.get(airnow_url, timeout=10)
        if airnow_resp.ok:
            raw = airnow_resp.json()
            airnow_data = _normalize_airnow_payload(raw, lat, lon)
        else:
            airnow_data = {"error": f"AirNow hata kodu: {airnow_resp.status_code}"}
    except Exception as e:
        airnow_data = {"error": f"AirNow alınamadı: {str(e)}"}



    # 🔹 TEMPO (her zamanki gibi)
    tempo_url = f"http://127.0.0.1:5000/tempo?lat={lat}&lon={lon}"
    if date:
        tempo_url += f"&date={date}"

    tempo_data = None
    try:
        tempo_resp = requests.get(tempo_url, timeout=20)
        if tempo_resp.ok:
            tempo_data = tempo_resp.json()
    except Exception as e:
        tempo_data = {"error": f"TEMPO alınamadı: {str(e)}"}

    return jsonify({
        "location": {"lat": lat, "lon": lon},
        "airnow": airnow_data,
        "tempo": tempo_data
    }), 200

def _airnow_historical_hour(lat: str, lon: str, date_str: str, hour: int, distance_km: int = 50) -> List[Dict[str, Any]]:
    """
    Tek bir saat için AirNow historical endpoint çağrısı (PM2.5 öncelikli).
    Tarih formatı: YYYY-MM-DD, saat: 0..23
    """
    # AirNow Historical formatı: 2024-05-01T00-0000
    slot = f"{date_str}T{hour:02d}-0000"
    url = (
        "https://www.airnowapi.org/aq/observation/latLong/historical/"
        f"?format=application/json&latitude={lat}&longitude={lon}"
        f"&date={slot}&distance={distance_km}&API_KEY={AIRNOW_KEY}"
    )
    try:
        r = requests.get(url, timeout=5)
        if r.ok:
            return r.json()
    except Exception:
        pass
    return []

def _collect_airnow_last_24h(lat: str, lon: str) -> List[Dict[str, Any]]:
    """
    Son 24 saat için (yerel saatlere takılmadan) iki güne yayılabilecek şekilde
    AirNow historical verileri toplanır (PM2.5 varsa onu seçeriz).
    """
    now = dt.datetime.utcnow()
    # Dün ve bugün (UTC) için iki tarih dizesi
    d0 = (now - dt.timedelta(days=1)).date().isoformat()
    d1 = now.date().isoformat()

    points = []  # {ts: datetime, aqi: int, param: str}
    # Son 24 saat = now-23 .. now saatleri
    hours = [now - dt.timedelta(hours=h) for h in range(23, -1, -1)]
    for hdt in hours:
        d = hdt.date().isoformat()
        h = hdt.hour
        resp = _airnow_historical_hour(lat, lon, d, h)
        if not resp:
            continue
        # Öncelik PM2.5, yoksa O3'ü deneriz:
        pm25 = [it for it in resp if str(it.get("ParameterName", "")).lower() in ("pm2.5", "pm25", "pm 2.5")]
        use = pm25[0] if pm25 else (resp[0] if resp else None)
        if use and use.get("AQI") is not None:
            points.append({
                "ts": hdt.replace(minute=0, second=0, microsecond=0),
                "aqi": int(use["AQI"]),
                "param": use.get("ParameterName", "AQI")
            })

    # Aynı saate birden fazla kayıt gelirse sonuncuyu tut
    dedup = {}
    for p in points:
        dedup[p["ts"]] = p
    out = [dedup[k] for k in sorted(dedup.keys())]
    return out

def _open_meteo_hourly(lat: float, lon: float, hours_back: int = 24, hours_ahead: int = 6) -> pd.DataFrame:
    """
    Open-Meteo (ücretsiz, anahtarsız) ile geçmiş + kısa vadeli hava durumu.
    Geriye dönük ve ileri saat tahminlerini tek bir DF halinde döndürür.
    """
    # Not: open-meteo geçmiş saatleri `past_hours` parametresiyle sağlar.
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&hourly=temperature_2m,windspeed_10m"
        f"&past_hours={hours_back}&forecast_hours={hours_ahead}"
        "&timezone=UTC"
    )
    try:
        r = requests.get(url, timeout=8)
        r.raise_for_status()
        j = r.json()
        hourly = j.get("hourly", {})
        times = hourly.get("time", [])
        temp = hourly.get("temperature_2m", [])
        wind = hourly.get("windspeed_10m", [])
        df = pd.DataFrame({
            "ts": pd.to_datetime(times),
            "temp": temp,
            "wind": wind
        })
        return df
    except Exception:
        # Hava durumu yoksa boş bir DF döndür (sütunlar sabit)
        return pd.DataFrame(columns=["ts", "temp", "wind"])
    
def _normalize_airnow_payload(raw, lat, lon):
    merged = {
        "location": {"lat": float(lat), "lon": float(lon)},
        "reportingArea": None, "stateCode": None, "observedAt": None,
        "aqi": {}, "category": {}
    }
    for item in raw or []:
        p = item.get("ParameterName")
        if not merged["reportingArea"]:
            merged["reportingArea"] = item.get("ReportingArea")
            merged["stateCode"] = item.get("StateCode")
            merged["observedAt"] = f'{item.get("DateObserved","").strip()} {item.get("HourObserved","")}:00'
        if p:
            merged["aqi"][p] = item.get("AQI")
            cat = item.get("Category", {}).get("Name")
            if cat: merged["category"][p] = cat
    return merged

    
def _fit_and_forecast_aqi(history_df: pd.DataFrame, weather_df: pd.DataFrame, horizon: int = 6) -> Dict[str, Any]:
    """
    Basit ama etkili bir kısa-vade model:
    Özellikler: zaman (index), temp, wind, lag1
    Model: Ridge regresyon (hızlı ve sağlam)
    Tahmin: recursive (her saati bir önceki tahmin lag1 olarak)
    """
    # Tarihleri birleştir
    df = history_df.merge(weather_df, on="ts", how="left")

    # Zaman indeksini sayısal yapalım (0..N-1)
    df = df.sort_values("ts").reset_index(drop=True)
    df["t"] = np.arange(len(df))

    # Lag1
    df["lag1"] = df["aqi"].shift(1)

    # Eğitim verisi
    train = df.dropna(subset=["aqi", "lag1"])  # lag1 üretmek için en az 2 nokta gerekir
    if len(train) < 8:
        # Veri yetersizse basit hareketli ortalama fallback
        last = df["aqi"].dropna().iloc[-1] if df["aqi"].dropna().size else None
        baseline = df["aqi"].dropna().rolling(3).mean().iloc[-1] if df["aqi"].dropna().size >= 3 else last
        preds = []
        for i in range(horizon):
            preds.append({
                "ts": (df["ts"].iloc[-1] + pd.Timedelta(hours=i+1)).isoformat(),
                "aqi_pred": float(baseline if baseline is not None else 50.0),
                "method": "moving_average_fallback"
            })
        return {"model": "fallback", "predictions": preds}

    X = train[["t", "temp", "wind", "lag1"]].fillna(method="ffill").fillna(method="bfill")
    y = train["aqi"].astype(float)

    model = Ridge(alpha=1.0)
    model.fit(X, y)

    # Gelecek saatler için iskelet zamanlar
    last_ts = df["ts"].iloc[-1]
    future_times = [last_ts + pd.Timedelta(hours=i+1) for i in range(horizon)]

    # Hava durumunu geleceğe al (mevcut `weather_df` forecast_hours ile birlikte geldi)
    weather_future = weather_df[weather_df["ts"].isin(future_times)].copy()
    # Eksik forecast varsa approx doldur:
    if len(weather_future) < horizon:
        add_rows = []
        for t in future_times:
            if t not in set(weather_future["ts"]):
                # Son bilinen değerlerle doldur
                add_rows.append({
                    "ts": t,
                    "temp": weather_df["temp"].iloc[-1] if len(weather_df) else np.nan,
                    "wind": weather_df["wind"].iloc[-1] if len(weather_df) else np.nan
                })
        if add_rows:
            weather_future = pd.concat([weather_future, pd.DataFrame(add_rows)], ignore_index=True)
    weather_future = weather_future.sort_values("ts").reset_index(drop=True)

    # Recursive tahmin: her adımda lag1 = bir önceki tahmin
    preds = []
    lag1 = df["aqi"].iloc[-1]  # son gerçek gözlem
    t_base = int(df["t"].iloc[-1])

    for i, row in weather_future.iterrows():
        features = pd.DataFrame([{
            "t": t_base + (i + 1),
            "temp": row["temp"],
            "wind": row["wind"],
            "lag1": lag1
        }]).fillna(method="ffill").fillna(method="bfill")

        y_hat = float(model.predict(features)[0])
        # sınırları makul tut (0..300)
        y_hat = max(0.0, min(300.0, y_hat))
        preds.append({
            "ts": row["ts"].isoformat(),
            "aqi_pred": y_hat,
            "method": "ridge+t,temp,wind,lag1"
        })
        lag1 = y_hat  # bir sonraki saat için

    return {
        "model": "ridge",
        "coefficients": getattr(model, "coef_", None).tolist(),
        "predictions": preds
    }

def _advisory(aqi: float) -> str:
    if aqi is None:
        return "No advisory."
    aqi = float(aqi)
    if aqi <= 50: return "Good — outdoor activities are safe."
    if aqi <= 100: return "Moderate — sensitive groups should monitor symptoms."
    if aqi <= 150: return "Unhealthy for Sensitive Groups — limit prolonged outdoor exertion."
    if aqi <= 200: return "Unhealthy — reduce outdoor activity; consider a mask."
    return "Very Unhealthy — avoid outdoor activity; wear a respirator mask."

@app.route('/forecast', methods=['GET'])
def forecast():
    """
    Kısa vadeli AQI tahmini (+6 saat).
    Giriş: lat, lon (string). İsteğe bağlı: horizon (saat, default 6)
    Çıkış: history (son 24h), weather_used, predictions, advisory
    """
    lat = request.args.get("lat", "40.7128")
    lon = request.args.get("lon", "-74.0060")
    horizon = int(request.args.get("horizon", "6"))

    # 1) Son 24 saat AirNow PM2.5 AQI topla
    history = _collect_airnow_last_24h(lat, lon)
    if not history:
        return jsonify({
            "location": {"lat": lat, "lon": lon},
            "error": "No AirNow history for the last 24h (try a different US location or increase distance)."
        }), 200

    hist_df = pd.DataFrame(history)  # columns: ts, aqi, param
    hist_df = hist_df.sort_values("ts").reset_index(drop=True)

    # 2) Hava durumu (geçmiş + gelecek)
    wx_df = _open_meteo_hourly(float(lat), float(lon), hours_back=24, hours_ahead=horizon)
    # Zaman uyumu için saat başı yuvarlayalım
    hist_df["ts"] = pd.to_datetime(hist_df["ts"]).dt.floor("H")
    wx_df["ts"] = pd.to_datetime(wx_df["ts"]).dt.floor("H")

    # 3) Modeli kur ve tahmin et
    model_out = _fit_and_forecast_aqi(hist_df[["ts", "aqi"]], wx_df[["ts", "temp", "wind"]], horizon=horizon)

    # 4) Son tahminin uyarısını ver
    last_pred = model_out.get("predictions", [{}])[-1].get("aqi_pred") if model_out.get("predictions") else None
    advice = _advisory(last_pred)

    return jsonify({
        "location": {"lat": lat, "lon": lon},
        "history_points": len(hist_df),
        "history": [
            {"ts": t.isoformat(), "aqi": int(a)} for t, a in zip(hist_df["ts"], hist_df["aqi"])
        ],
        "weather_used": wx_df.tail(24 + horizon).assign(
            ts=lambda d: d["ts"].dt.tz_localize("UTC").dt.strftime("%Y-%m-%dT%H:%M:%SZ")
        )[["ts", "temp", "wind"]].to_dict(orient="records"),
        "model": model_out.get("model"),
        "predictions": model_out.get("predictions", []),
        "advisory": advice
    }), 200


if __name__ == '__main__':
    app.run(debug=True)
