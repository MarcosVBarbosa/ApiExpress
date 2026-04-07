import { Op } from 'sequelize';
import FilesModel from '../models/FilesModel.js';

// Utils
import { DeleteFile } from '../utils/file/DeleteFile.js';

function validateId(id) {
  return !isNaN(Number(id));
}

class FilesController {
  async index(req, res) {
    try {
      const { name, status, sort, page, limit } = req.query;

      const where = {};

      if (name) where.name = { [Op.iLike]: `%${name}%` };

      if (status !== undefined) {
        where.status = ['true', '1', 'yes'].includes(
          String(status).toLowerCase()
        );
      }

      const allowedFields = ['name', 'created_at', 'updated_at', 'status'];

      const order = [];

      if (sort) {
        const [field, direction] = sort.split(':');

        if (allowedFields.includes(field)) {
          order.push([
            field,
            direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
          ]);
        }
      }

      const pageNumber = Number(page) || 1;
      const pageSize = Math.min(Number(limit) || 10, 100);

      const { rows, count } = await FilesModel.findAndCountAll({
        where,
        order,
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
      return res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!validateId(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const file = await FilesModel.findByPk(id);

      if (!file) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      return res.json(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar arquivo' });
    }
  }

  async create(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const file = await FilesModel.create({
        name: req.file.originalname,
        key: req.file.filename, // 🔥 importante
        path: req.file.path,
        size: req.file.size,
        mime_type: req.file.mimetype,
        status: true,
      });

      return res.status(201).json(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao enviar arquivo' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!validateId(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const file = await FilesModel.findByPk(id);

      if (!file) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      const { name, status } = req.body;

      if (name !== undefined) file.name = name;
      if (status !== undefined) file.status = status;

      await file.save();

      return res.json(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar arquivo' });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!validateId(id)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const file = await FilesModel.findByPk(id);

      if (!file) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      // Remove do banco
      await file.destroy();

      // Remove do storage (não quebra se falhar)
      try {
        await DeleteFile(file);
      } catch (err) {
        console.warn('Erro ao deletar arquivo físico:', err.message);
      }

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar arquivo' });
    }
  }
}

export default new FilesController();
