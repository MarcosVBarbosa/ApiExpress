import UsersModel from '../models/UsersModel.js';
import { Op } from 'sequelize';

class UsersController {
  // 📄 LISTAR
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
      } = req.query;

      const where = {};

      // 🔍 Filtro por nome
      if (name) {
        where.name = { [Op.iLike]: `%${name}%` };
      }

      // 🔍 Status
      if (status !== undefined) {
        where.status = status === 'true';
      }

      // 🔍 FK
      if (permissions_user_id) {
        where.permissions_user_id = Number(permissions_user_id);
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

      // 🔢 Com total (melhor que findAll)
      const { rows, count } = await UsersModel.findAndCountAll(query);

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

      const user = await UsersModel.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // ➕ CRIAR
  async create(req, res) {
    try {
      const { name, password_hash, status, permissions_user_id } = req.body;

      const user = await UsersModel.create({
        name,
        password_hash,
        status,
        permissions_user_id,
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // ✏️ ATUALIZAR
  async update(req, res) {
    try {
      const { id } = req.params;

      const user = await UsersModel.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const { name, password_hash, status, permissions_user_id } = req.body;

      await user.update({
        name,
        password_hash,
        status,
        permissions_user_id,
      });

      return res.json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // ❌ DELETAR
  async destroy(req, res) {
    try {
      const { id } = req.params;

      const user = await UsersModel.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new UsersController();
