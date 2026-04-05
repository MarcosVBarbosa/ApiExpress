import PermissionsUsersModel from '../models/PermissionsUsersModel.js';
import { Op } from 'sequelize';
import * as Yup from 'yup';

class PermissionsUsersController {
  /**
   * @swagger
   * /permissions-users:
   *   get:
   *     summary: Lista permissões
   *     tags: [PermissionsUsers]
   *     parameters:
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *       - in: query
   *         name: description
   *         schema:
   *           type: string
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: ["true", "false"]
   *           example: "true"
   *       - in: query
   *         name: createdBefore
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: createdAfter
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: updatedBefore
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: updatedAfter
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           example: name:ASC
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *           maximum: 100
   *     responses:
   *       200:
   *         description: Lista de permissões
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro interno
   */
  async index(req, res) {
    try {
      const {
        name,
        status,
        description,
        createdBefore,
        createdAfter,
        updatedBefore,
        updatedAfter,
        sort,
        page,
        limit,
      } = req.query;

      const where = {};

      if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
      }

      if (description) {
        where.description = { [Op.iLike]: `%${description}%` };
      }

      const parseBoolean = (value) =>
        ['true', '1', 'yes'].includes(String(value).toLowerCase());

      if (status !== undefined) {
        where.status = parseBoolean(status);
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
      const allowedSortFields = [
        'name',
        'description',
        'createdAt',
        'updatedAt',
        'status',
      ];

      if (sort) {
        const [field, direction] = sort.split(':');

        if (allowedSortFields.includes(field)) {
          order.push([
            field,
            direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
          ]);
        }
      }

      const pageNumber = Number(page) || 1;
      const pageSize = Math.min(Number(limit) || 10, 100);

      const { rows, count } = await PermissionsUsersModel.findAndCountAll({
        where,
        order,
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
      return res.status(500).json({ error: 'Erro ao listar permissões' });
    }
  }

  /**
   * @swagger
   * /permissions-users/{id}:
   *   get:
   *     summary: Buscar permissão por ID
   *     tags: [PermissionsUsers]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       200:
   *         description: Permissão encontrada
   *       404:
   *         description: Permissão não encontrada
   */
  async show(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = await PermissionsUsersModel.findByPk(id);

      if (!data) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar permissão' });
    }
  }

  /**
   * @swagger
   * /permissions-users:
   *   post:
   *     summary: Criar permissão
   *     tags: [PermissionsUsers]
   *     responses:
   *       201:
   *         description: Permissão criada
   *       400:
   *         description: Dados inválidos
   */
  async create(req, res) {
    try {
      const { name, description, permissions, status } = req.body;

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string().required(),
        status: Yup.boolean(),
        permissions: Yup.object().required(),
      });

      await schema.validate(
        { name, description, permissions, status },
        { abortEarly: false }
      );

      const data = await PermissionsUsersModel.create({
        name,
        description,
        permissions,
        status: status ?? true,
      });

      return res.status(201).json(data);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar permissão' });
    }
  }

  /**
   * @swagger
   * /permissions-users/{id}:
   *   put:
   *     summary: Atualizar permissão
   *     tags: [PermissionsUsers]
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = await PermissionsUsersModel.findByPk(id);

      if (!data) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      const { name, description, permissions, status } = req.body;

      const schema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
        status: Yup.boolean(),
        permissions: Yup.object(),
      });

      await schema.validate(
        { name, description, permissions, status },
        { abortEarly: false }
      );

      const updateData = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (permissions !== undefined) updateData.permissions = permissions;
      if (status !== undefined) updateData.status = status;

      await data.update(updateData);

      return res.json(data);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar permissão' });
    }
  }

  /**
   * @swagger
   * /permissions-users/{id}:
   *   delete:
   *     summary: Deletar permissão
   *     tags: [PermissionsUsers]
   *     responses:
   *       204:
   *         description: Deletado com sucesso
   */
  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const data = await PermissionsUsersModel.findByPk(id);

      if (!data) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      await data.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar permissão' });
    }
  }
}

export default new PermissionsUsersController();
