const { conectar } = require("../controllers/controladorDeUsuario");
const { Usuario } = require("../models/Usuario");
const RepositorioDeUsuario = require("../repositories/repositorioDeUsuario");
const jwt = require("jsonwebtoken");
const z = require("zod");
const { HttpError } = require("../repositories/repositorioDeUsuario");

class ServicoDeUsuario {
  buscarTodos() {
    return RepositorioDeUsuario.buscarTodos();
  }

  cadastrar(nome, email, cpf, senha) {
    z.object({
      nome: z.string({ required_error: "O nome é obrigatório, e tem que ser uma string." }).trim().min(3),
      email: z.string().email({ message: "O email não é válido" }),
      cpf: z.string().trim().min(11),
      senha: z.string().trim().min(8)
    });

    const validacao = usuarioSchema.safeParse({nome, email, cpf, senha});
    if (validacao.success === false ) {
      return validacao.error.format();
    }

    const usuario = new Usuario(nome, email, cpf, senha);
    return RepositorioDeUsuario.criar(usuario);
  }

  conectar(email, senha) {
    //verifica se o usuario existe
    const usuarioExistente = RepositorioDeUsuario.pegarPeloEmail(email);
    //retorna um erro
    if (!usuarioExistente) {
      throw new HttpError(404, "Usuario inexistente");
    }
    //verifica a senha
    const autenticado = usuarioExistente.compararSenha(senha)
    //retorna um erro, senão bater
    if (!autenticado) {
      throw new Error(401, "Senha incorreta");
    }
    //gera o token, salva, e retorna pro merdinhha
    jwt.sign({ id: usuarioExistente.id }, "sentonobicodaglockreboloetirooshortevemvamofuder", {
      expiresIn: "1d"
    });
    //retorna token
    return token;
  }

}

module.exports = new ServicoDeUsuario();
