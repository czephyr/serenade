# Documentazione MkDocs

## Modificare la documentazione e compilare localmente

Creare un virtual environment python poi

``` sh
pip install -r requirements.txt
mkdocs serve
```

Il comando `serve` compila hot-reload la documentazione a `127.0.0.1:8000`.

Nella cartella `docs` si trovano i files `.md` source.
Per inserire un nuovo file modificare il campo `nav` in `mkdocs.yml`.

Per più informazioni si rimanda alla doc di MkDocs e alla [documentazione del tema Mkdocs-material](https://squidfunk.github.io/mkdocs-material/)
