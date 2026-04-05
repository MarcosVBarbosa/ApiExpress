import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import UsersModel from '../models/UsersModel.js';
import authConfig from '../../config/auth.js';

class SessionsController {
  /**
   * @swagger
   * /sessions:
   *   post:
   *     summary: Login do usuário
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 example: admin
   *               password:
   *                 type: string
   *                 example: 12345678
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Usuário ou senha inválidos
   */
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        password: Yup.string().required(),
      });

      await schema.validate(req.body, { abortEarly: false });

      const { name, password } = req.body;

      const user = await UsersModel.scope('withPassword').findOne({
        where: { name },
      });

      if (!user) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          status: user.status,
        },
        token: jwt.sign({ id: user.id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Erro ao realizar login' });
    }
  }
}

export default new SessionsController();
