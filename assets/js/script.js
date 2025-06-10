document.addEventListener("DOMContentLoaded", function () 
{
    const titleInput = document.getElementById("title-input");
    const generoInput = document.getElementById("genero-input");
    const anoInput = document.getElementById("ano-input");
    const addFilmBtn = document.getElementById("add-film");
    const filmList = document.getElementById("film-list");
    const genreFilter = document.getElementById("genre-filter");
    const filmCountDisplay = document.getElementById("film-count");

    let filmes = JSON.parse(localStorage.getItem("filmes")) || [];

    function saveFilmes() 
    {
        localStorage.setItem("filmes", JSON.stringify(filmes));
    }

    // Atualiza a contagem de filmes exibida na tela, com base no filtro de gênero
    function updateFilmCount(generoSelecionado = "all") 
    {
        const generoNormalizado = generoSelecionado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const total = filmes.filter(film => 
        {
            if (generoSelecionado === "all") 
            {
                return true;
            } 
            else 
            {
                const generoFilmeNormalizado = film.genero.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return generoFilmeNormalizado === generoNormalizado;
            }
        }).length;

        filmCountDisplay.textContent = `${total} filme${total !== 1 ? 's' : ''}`;
    }


    // Renderiza a lista de filmes na tela, com base no gênero selecionado
    function renderFilmes(generoSelecionado = "all") 
    {
        filmList.innerHTML = "";

        const noFilmsMessage = document.getElementById("no-films-message");
        let filmesRenderizados = 0;

        filmes.forEach(function (film, index) 
        {
            if 
            (
                generoSelecionado !== "all" &&
                film.genero.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") !==
                generoSelecionado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            )
            return;

            filmesRenderizados++;

            // Cria os elementos da lista
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="film-text">
                    <strong>${film.text}</strong> | ${film.genero} | (${film.ano})
                </span>
                <div>
                    <button class="edit"><img class="edit" src="assets/img/editar.png"></button>
                    <button class="delete"><img class="delete" src="assets/img/excluir.png"></button>
                </div>
            `;


            // Deletar e Excluir
            li.addEventListener("click", function (e) 
            {
                if (e.target.classList.contains("delete")) 
                {
                    filmes.splice(index, 1);
                } 
                else if (e.target.classList.contains("edit")) 
                {
                    const newText = prompt("Editar título do filme:", film.text) || film.text;
                    const newGenero = prompt("Editar gênero do filme:", film.genero) || film.genero;
                    const newAno = prompt("Editar ano do filme:", film.ano) || film.ano;

                    filmes[index].text = newText;
                    filmes[index].genero = newGenero;
                    filmes[index].ano = newAno;
                }

                saveFilmes();
                renderFilmes(genreFilter.value);
            });

            filmList.appendChild(li);
        });


        // Mostra ou esconde a mensagem Sem Filmes
        if (filmesRenderizados === 0) 
        {
            noFilmsMessage.style.display = "block";
        } 
        else 
        {
            noFilmsMessage.style.display = "none";
        }

        updateFilmCount(generoSelecionado);
    }


    // Add novo Filme
    addFilmBtn.addEventListener("click", function () 
    {
        const text = titleInput.value.trim();
        const genero = generoInput.value.trim();
        const ano = anoInput.value.trim();

        if (text && genero && ano) 
        {
            filmes.push({ text, genero, ano });
            saveFilmes();
            renderFilmes(genreFilter.value);

            titleInput.value = "";
            generoInput.value = "";
            anoInput.value = "";
        }
    });


    // Filtro de Genero
    genreFilter.addEventListener("change", () => 
    {
        renderFilmes(genreFilter.value);
    });

    renderFilmes();
});
