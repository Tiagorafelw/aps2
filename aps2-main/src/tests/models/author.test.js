import { describe, expect, it, jest, afterEach } from "@jest/globals"
import AuthorController from "../../controllers/authorController.js"
import * as AuthorModule from "../../models/Author.js"
import { AuthorDTO } from "../../dtos/authorDTO.js"

jest.mock("../../models/Author.js")

describe("Testando o Author Controller", () => {

    const mockRequest = (data = {}, params = {}) => ({ body: data, params });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    }
    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Deve listar todos os nomes", async () => {
        const authorMock = [
            {
                name: "name",
                email: "Email.com"
            },
            {
                name: "name3",
                email: "Email3.com"
            }
        ]

        AuthorModule.author.find = jest.fn().mockResolvedValue(authorMock);

        const res = mockResponse();
        const req = mockRequest();

        const authorController = new AuthorController();
        await authorController.getAllAuthor(req, res);

        expect(AuthorModule.author.find).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(authorMock);

    });

    it("Deve Criar um novo autor", async () => {
        const newAuthor = { name: "Novo", email: "novo@email.com" };
        AuthorModule.author.create = jest.fn().mockResolvedValue(newAuthor);

        const req = mockRequest(newAuthor);
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.createAuthor(req, res);

        expect(AuthorModule.author.create).toHaveBeenCalledWith(newAuthor)
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Author Criado com sucesso",
            Author: new AuthorDTO(newAuthor),
        })

    });
    it("Deve Buscar o author por ID", async () => {
        const authorMock = { _id: "123", name: "novo", email: "novo@email.com" };
        AuthorModule.author.findById = jest.fn().mockResolvedValue(authorMock);

        const req = mockRequest({}, {id: "123"});
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.getAuthorById(req, res);

        expect(AuthorModule.author.findById).toHaveBeenCalledWith("123")
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith( new AuthorDTO(authorMock))

    });

    it("Deve retornar 404 se autor não for encontrado", async () => {
        AuthorModule.author.findById = jest.fn().mockResolvedValue(null);

        const req = mockRequest({}, { id: "naoexiste" });
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.getAuthorById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Autor não encontrado!");

    });

    it("Deve buscar autores por nome", async () => {
        const authorsMock = [
            {
                name: "name",
                email: "Email.com"
            },
            {
                name: "name3",
                email: "Email3.com"
            }
        ]
        AuthorModule.author.findById = jest.fn().mockResolvedValue(authorsMock);

        const req = mockRequest({}, { name:"name"});
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.searchAuthorByName(req, res);

        expect(AuthorModule.author.find).toHaveBeenCalledWith({
            name: { $regex: "name", $options: "i"}
        }

        )


        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            authorsMock.map((a) => new AuthorDTO(a))
        );

    });

    it("Deve erro ao buscar por nome", async () => {


        const req = mockRequest({}, { name: "" });
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.searchAuthorByName(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Informar o nome do Autor");

    });

    it("Deve atualizar um autor por ID", async () => {
        const updatedAuthor = [
            {
                _id: "123", name: "name",
                email: "Email.com"
            },
        ]

        AuthorModule.author.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedAuthor);


        const req = mockRequest({ name: "Atualizado" }, {id: "123"});
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.updateAuthor(req, res);


        expect(AuthorModule.author.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { name: "Atualizado" },
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Author atualizado com sucesso",
            authors: new AuthorDTO(updatedAuthor),
        });

    });

    it("Deve retornar 404 ao atualizar um autor por ID", async () => {

        AuthorModule.author.findByIdAndUpdate = jest.fn().mockResolvedValue(null);


        const req = mockRequest({}, { name: "Falha" }, { id: "000" });
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.updateAuthor(req, res);


        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Autor não encontrado!");

    });

    it("Deve Excluir um Author por ID", async () => {

        AuthorModule.author.findByIdAndDelete = jest.fn().mockResolvedValue({});


        const req = mockRequest({}, { id: "321" });
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.deletedAuthor(req, res);


        expect(AuthorModule.author.findByIdAndDelete).toHaveBeenCalledWith("321");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith("Autor deletado");

    });

    it("Deve retornar 404 Excluir um Author por ID", async () => {

        AuthorModule.author.findByIdAndDelete = jest.fn().mockResolvedValue(null);


        const req = mockRequest({}, { id: "999" });
        const res = mockResponse();
        const controller = new AuthorController();

        await controller.deletedAuthor(req, res);


        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Autor não encontrado!");

    });
});