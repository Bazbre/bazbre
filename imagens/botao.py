from flask import Flask, request, render_template_string 
app = Flask(__name__) 
html_page = """ <!DOCTYPE html> 
<html>
 <head> 
 <title>Busca com Python</title>
   </head> 
   <body>
     <h1>Buscar</h1>
       <form action="/buscar" method="post"> 
       <input type="text" name="query" placeholder="Digite sua busca"> 
       <button type="submit">Buscar</button> 
       </form> 
       </body>
         </html> """
@app.route("/") def index(): return render_template_string(html_page) @app.route("/buscar", methods=["POST"]) def buscar(): termo = request.form.get("query") 
#pega o que foi digitado # Aqui você coloca a lógica da busca (ex: banco de dados, lista, API) return f"Você buscou por: {termo}" 
if __name__ == "__main__": app.run(debug=True)