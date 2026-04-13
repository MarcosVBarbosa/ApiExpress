import { Op } from 'sequelize';
import * as Yup from 'yup';

// Models
import RolesModel from '../models/RolesModel.js';

// Utils
import { ParseBoolean } from '../utils/parsers/ParseBoolean.js';
import { ParseDateRange } from '../utils/parsers/ParseDateRange.js';

function validateId(id) {
  return !isNaN(Number(id));
}

class RolesController {
  // Listar roles
  async index(req, res) {
    try {
      const {
        name,
        description,
        status,
        createdBefore,
        createdAfter,
        updatedBefore,
        updatedAfter,
        sort,
        page,
        limit,
      } = req.query;

      const where = {};

      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (description) where.description = { [Op.iLike]: `%${description}%` };
      if (status !== undefined) where.status = ParseBoolean(status);

      const createdRange = ParseDateRange(createdBefore, createdAfter);
      if (createdRange) where.created_at = createdRange;

      const updatedRange = ParseDateRange(updatedBefore, updatedAfter);
      if (updatedRange) where.updated_at = updatedRange;

      const allowedSortFields = [
        'name',
        'description',
        'created_at',
        'updated_at',
        'status',
      ];

      const order = [];

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

      const { rows, count } = await RolesModel.findAndCountAll({
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
      return res.status(500).json({ error: 'Erro ao listar roles' });
    }
  }

  // Buscar role por ID
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!validateId(id))
        return res.status(400).json({ error: 'ID inválido' });

      const role = await RolesModel.findByPk(id);

      if (!role) return res.status(404).json({ error: 'Role não encontrada' });

      return res.json(role);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar roles' });
    }
  }

  // Criar role
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string().required(),
        crud: Yup.object().required(),
        status: Yup.boolean(),
      });

      await schema.validate(req.body, { abortEarly: false });

      const { name, description, crud, status } = req.body;

      const roleExists = await RolesModel.findOne({
        where: { name },
      });

      if (roleExists) {
        return res.status(400).json({ error: 'Role já existe' });
      }

      const role = await RolesModel.create({
        name,
        description,
        crud,
        status: status ?? true,
      });

      return res.status(201).json(role);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar roles' });
    }
  }

  // Atualizar role
  async update(req, res) {
    try {
      const { id } = req.params;

      if (!validateId(id))
        return res.status(400).json({ error: 'ID inválido' });

      const role = await RolesModel.findByPk(id);

      if (!role) return res.status(404).json({ error: 'Role não encontrada' });

      const schema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
        crud: Yup.object(),
        status: Yup.boolean(),
      });

      await schema.validate(req.body, { abortEarly: false });

      if (req.body.name) {
        const roleExists = await RolesModel.findOne({
          where: {
            name: req.body.name,
            id: { [Op.ne]: id },
          },
        });

        if (roleExists) {
          return res.status(400).json({ error: 'Role já existe' });
        }
      }

      await role.update({ ...req.body });

      return res.json(role);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({ errors: error.errors });
      }

      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar roles' });
    }
  }

  // Deletar role
  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!validateId(id))
        return res.status(400).json({ error: 'ID inválido' });

      const role = await RolesModel.findByPk(id);

      if (!role) return res.status(404).json({ error: 'Role não encontrada' });

      await role.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar roles' });
    }
  }
}

export default new RolesController();
