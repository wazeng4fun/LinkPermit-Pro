import os
import requests

def ping_supabase():
    # Mengambil data dari Secrets GitHub
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")

    if not url or not key:
        print("Error: URL atau API Key tidak ditemukan di environment variables.")
        return

    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }

    try:
        # Melakukan request sederhana ke tabel manapun atau endpoint rest
        # Kita panggil endpoint rest dasar untuk mengecek status
        response = requests.get(f"{url}/rest/v1/", headers=headers)
        if response.status_code == 200:
            print(f"Berhasil! Supabase tetap terjaga. Status: {response.status_code}")
        else:
            print(f"Ping terkirim tapi mendapat respon: {response.status_code}")
    except Exception as e:
        print(f"Terjadi kesalahan saat menghubungi Supabase: {e}")

if __name__ == "__main__":
    ping_supabase()
