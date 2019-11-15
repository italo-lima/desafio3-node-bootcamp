'use strict';

//Inserindo uma coluna na tabela já existente (como foi uma pk a continuação está no model registration)
module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.addColumn(
        'registrations', 
        'plan_id',
        {
          type: Sequelize.INTEGER,
          references: {model: 'plans', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true
        }
        );
  },

  down: (queryInterface) => {
    
      return queryInterface.removeColumn('registrations', 'plan_id',);
    
  }
};
