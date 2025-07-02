# Usa un'immagine base di Python
FROM python:3.10-slim

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file necessari del progetto
COPY . /app

# Installa le dipendenze
RUN pip install --no-cache-dir rasa

# Espone la porta per le API REST
EXPOSE 5005

# Comando per eseguire il server Rasa
CMD ["rasa", "run", "--enable-api", "--cors", "*", "--debug"]