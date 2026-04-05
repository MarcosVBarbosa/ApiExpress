import PermissionsUsersModel from '../models/PermissionsUsersModel.js';
import UsersModel from '../models/UsersModel.js';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';

class UsersController {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Lista usuários
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: ["true", "false"]
   *       - in: query
   *         name: permissions_user_id
   *         schema:
   *           type: integer
   *       - in: query
   *         name: includePermission
   *         schema:
   *           type: string
   *           enum: ["true", "false"]
   */
  async index(req, res) {
    try {
      const {
        name,
        status,
        permissions_user_id,
        createdBefore,
        createdAfter,
        updatedBefore,
        updatedAfter,
        sort,
        page,
        limit,
        includePermission,
      } = req.query;

      const where = {};

      if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
      }

      const parseBoolean = (value) =>
        ['true', '1', 'yes'].includes(String(value).toLowerCase());

      if (status !== undefined) {
        where.status = parseBoolean(status);
      }

      if (permissions_user_id && !isNaN(Number(permissions_user_id))) {
        where.permissions_user_id = Number(permissions_user_id);
      }

      const isValidDate = (date) => !isNaN(new Date(date).getTime());

      if (createdBefore || createdAfter) {
        where.createdAt = {};
        if (createdBefore && isValidDate(createdBefore)) {
          where.createdAt[Op.lte] = new Date(createdBefore);
        }
        if (createdAfter && isValidDate(createdAfter)) {
          where.createdAt[Op.gte] = new Date(createdAfter);
        }
      }

      if (updatedBefore || updatedAfter) {
        where.updatedAt = {};
        if (updatedBefore && isValidDate(updatedBefore)) {
          where.updatedAt[Op.lte] = new Date(updatedBefore);
        }
        if (updatedAfter && isValidDate(updatedAfter)) {
          where.updatedAt[Op.gte] = new Date(updatedAfter);
        }
      }

      const order = [];
      const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'status'];

      if (sort) {
        const [field, direction] = sort.split(':');

        if (allowedSortFields.includes(field)) {
          order.push([
            field,
            direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
          ]);
        }
      }

      const include = [];

      if (includePermission === 'true') {
        include.push({
          model: PermissionsUsersModel,
          as: 'permissionUser',
          attributes: ['id', 'name', 'permissions'],
          required: false,
        });
      }

      const pageNumber = Number(page) || 1;
      const pageSize = Math.min(Number(limit) || 10, 100);

      const { rows, count } = await UsersModel.findAndCountAll({
        attributes: { exclude: ['password_hash'] },
        where,
        order,
        include,
        distinct: true,
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
      });

      return res.json({
        data: rows,
        total: count,
        page: pageNumber,
        limit: pageSize,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Buscar usuário por ID
   *     tags: [Users]
   */
  async show(req, res) {
    try {
      const { id } = req.params;
      const { includePermission } = req.query;

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const include = [];

      if (includePermission === 'true') {
        include.push({
          model: PermissionsUsersModel,
          as: 'permissionUser',
          attributes: ['id', 'name', 'permissions'],
        });
      }

      const user = await UsersModel.findByPk(id, {
        include,
        attributes: { exclude: ['password_hash'] },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Criar usuário
   *     tags: [Users]
   */
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        password: Yup.string().required().min(8),
        status: Yup.boolean(),
        permissions_user_id: Yup.number().required(),
      });

      await schema.validate(req.body, { abortEarly: false });

      const password_hash = await bcrypt.hash(req.body.password, 8);

      const user = await UsersModel.create({
        name: req.body.name,
        password_hash,
        status: req.body.status ?? true,
        permissions_user_id: req.body.permissions_user_id,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        status: user.status,
        permissions_user_id: user.permissions_user_id,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Atualizar usuário
   *     tags: [Users]
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const user = await UsersModel.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { name, status, permissions_user_id, password } = req.body;

      const schema = Yup.object().shape({
        name: Yup.string(),
        status: Yup.boolean(),
        permissions_user_id: Yup.number(),
        password: Yup.string().min(8),
      });

      await schema.validate(
        { name, status, permissions_user_id, password },
        { abortEarly: false }
      );

      const data = {};

      if (name !== undefined) data.name = name;
      if (status !== undefined) data.status = status;
      if (permissions_user_id !== undefined)
        data.permissions_user_id = permissions_user_id;

      if (password) {
        data.password_hash = await bcrypt.hash(password, 8);
      }

      await user.update(data);

      return res.json({
        id: user.id,
        name: user.name,
        status: user.status,
        permissions_user_id: user.permissions_user_id,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Deletar usuário
   *     tags: [Users]
   */
  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const user = await UsersModel.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
}

export default new UsersController();
