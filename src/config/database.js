export default {
  dialect: 'postgres',
  host: 'dpg-d779kqua2pns73949c60-a.virginia-postgres.render.com',
  port: 5432,
  username: 'root',
  password: 'viwwnWzZeDCz74x6roKfCbOk4vUyBvTF',
  database: 'bdpostgres_stdh',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
