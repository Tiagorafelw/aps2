import { AuthorDTO } from "../dtos/authorDTO.js";
//import {author} from "../models/Author.js";
import { AuthorService } from "../services/authorService.js";

class AuthorController{
    constructor(){
        this.authorService = new AuthorService()
    }
    getAllAuthor = async(req, res) =>{
        try{
            const listAuthors = await this.authorService.getAllAuthor();
            res.status(200).json(listAuthors.map((author) => new AuthorDTO(author)));
        }
        catch(error){
            res.status(500).send(error.message)
        }
    }

    
    createAuthor = async (req, res)=>{
        try{
            const newAuthor = await this.authorService.createAuthor(req.body);
            
            res.status(201).json({
                message: "Author Criado com sucesso",
                Author: new AuthorDTO(newAuthor),
            }
            )
        }
        catch(error){
            res.status(500).send(error.message)
        }
    
    };

    
    getAuthorById = async (req, res) =>{
        try{
            const AuthorById = await this.authorService.getAuthorById(req.params.id);
            if (!AuthorById){
            return res.status(404).send("Author não encontrado")
            }
            res.status(200).json(new AuthorDTO(AuthorById))
            
        }
        catch(error){
            res.status(404).send(error.message)
        }
    };

    searchAuthorByName = async(req, res) =>{
        try{
            const {name} = req.params;
            const authors = await this.authorService.searchAutorByName(name);
            if(authors.lenght === 0){
                return res.status(404).json({
                    message: "Não encontrado",
                    name: name,
            });
        }
            res.status(200).json(authors.map((author) => new AuthorDTO(author)));
        }
        catch(error){
            res.status(404).send(error.message)
        }
    };

    
    updateAuthor = async (req, res) =>{
        try{
            const updateAuthor = await this.authorService.updateAuthor(req.params.id, req.body, {
                new: true,
            });
            if (!updateAuthor){
            return res.status(404).send("Author não encontrado")
            }
    
            res.status(201).json({
                message: "Author atualizado com sucesso",
                authors: new AuthorDTO(updateAuthor),
            }
            )
        }
        catch(error){
            res.status(404).send(error.message)
        }
    }

    deletedAuthor = async (req, res) =>{
        try{
            const deleteAuthor = await this.authorService.deleteAuthor(req.params.id);
            if (!deleteAuthor){
            return res.status(404).send("Author não encontrado")
            }
    
            res.status(200).json("Autor deletado")
        }
        catch(error){
            res.status(404).send(error.message)
        }
    }
    
    }


export default AuthorController;
//export default new AuthorController();