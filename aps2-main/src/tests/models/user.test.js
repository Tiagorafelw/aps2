import { describe, expect, it, jest, afterEach } from "@jest/globals";
import UserController from "../../controllers/userController.js";
import { UserDTO } from "../../dtos/userDTO.js";
import mongoose from "mongoose";

const mockUserService = {
    register: jest.fn(),
};

describe("Testando o UserController com acesso direto ao Model", () => {
    const mockRequest = (body = {}, params = {}) => ({ body, params });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("Deve criar um novo usuário", async () => {
        const newUser = {
            name: "Novo",
            email: "novo@email.com",
            password: "novo123",
        };

        mockUserService.register.mockResolvedValue(newUser);

        const controller = new UserController(mockUserService);

        const req = mockRequest(newUser);
        const res = mockResponse();

        await controller.createUser(req, res);

        expect(mockUserService.register).toHaveBeenCalledWith(newUser);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "User Criado com sucesso",
            User: new UserDTO(newUser),
        });
    }, 1000000);
});