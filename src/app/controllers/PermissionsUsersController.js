import PermissionsUsersModel from '../models/PermissionsUsersModel.js';
import { Op } from 'sequelize';

class PermissionsUsersController {
  // 📄 LISTAR
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

      // 🔍 Nome
      if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
      }

      // 🔍 Descrição
      if (description) {
        where.description = { [Op.iLike]: `%${description}%` };
      }

      // 🔍 Status
      if (status !== undefined) {
        where.status = status === 'true';
      }

      // 📅 Datas criação
      if (createdBefore || createdAfter) {
        where.created_at = {};
        if (createdBefore) {
          where.created_at[Op.lte] = new Date(createdBefore);
        }
        if (createdAfter) {
          where.created_at[Op.gte] = new Date(createdAfter);
        }
      }

      // 📅 Datas atualização
      if (updatedBefore || updatedAfter) {
        where.updated_at = {};
        if (updatedBefore) {
          where.updated_at[Op.lte] = new Date(updatedBefore);
        }
        if (updatedAfter) {
          where.updated_at[Op.gte] = new Date(updatedAfter);
        }
      }

      // 🔃 Ordenação
      const order = [];
      if (sort) {
        const [field, direction] = sort.split(':');
        order.push([field, direction?.toUpperCase() || 'ASC']);
      }

      const query = {
        where,
        order,
      };

      // 📄 Paginação opcional
      if (limit) {
        query.limit = Number(limit);
      }

      if (page && limit) {
        query.offset = (Number(page) - 1) * Number(limit);
      }

      const { rows, count } =
        await PermissionsUsersModel.findAndCountAll(query);

      return res.json({
        data: rows,
        total: count,
        page: page ? Number(page) : null,
        limit: limit ? Number(limit) : null,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // 🔍 BUSCAR POR ID
  async show(req, res) {
    try {
      const { id } = req.params;

      const data = await PermissionsUsersModel.findByPk(id);

      if (!data) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      return res.json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // ➕ CRIAR
  async create(req, res) {
    try {
      const { name, description, permissions, status } = req.body;

      const data = await PermissionsUsersModel.create({
        name,
        description,
        permissions,
        status,
      });

      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // ✏️ ATUALIZAR
  async update(req, res) {
    try {
      const { id } = req.params;

      const data = await PermissionsUsersModel.findByPk(id);

      if (!data) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      const { name, description, permissions, status } = req.body;

      await data.update({
        name,
        description,
        permissions,
        status,
      });

      return res.json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // ❌ DELETAR
  async destroy(req, res) {
    try {
      const { id } = req.params;

      const data = await PermissionsUsersModel.findByPk(id);

      if (!data) {
        return res.status(404).json({ error: 'Permissão não encontrada' });
      }

      await data.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new PermissionsUsersController();
