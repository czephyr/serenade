import os

SMS_PATIENT_CREATE = """Nuova installazion da effettuare, buon lavoro!"""
ADMIN_USERNAME = "~Serenade"
SALT_HASH = bytes.fromhex(os.environ.get("SALT_HASH", ""))
