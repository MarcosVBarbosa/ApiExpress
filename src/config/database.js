module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'root',
  password: 'admin',
  database: 'basic-painel',
  define: {
    timestamp: true, // ciras duas colunas: createAt e updateAt
    underscored: true, // nomeclatura _ (não  camelCase) customersGroup => customers_group
    underscoredAll: true,
  },
};
