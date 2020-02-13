const express  =  require('express');
const bodyParser  =  require('body-parser');
const app  =  express();
const connection = require('./config');
const cors = require('cors');

const port = process.env.PORT  ||  5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended:  false }));
app.use(bodyParser.json());


/*
exemple:
http://localhost:5000/dashboard/orders/?limit=10&offset=5&orderby=name&order=asc

test:
http://localhost:5000/dashboard/orders/?orderby=name&order=asc&limit=2&offset=0&
let sqlQuerry = `${orderSql.GET} ORDER BY ${req.query.orderby} ${req.query.order}`;
*/


app.delete("/dashboard/orders/:id", (req, res) => {
  const commande = req.params.id;
  connection.query(
      "DELETE FROM Orders WHERE order_number= ?",
      [commande],
      (error, results, fields) => {
          if (error) {
              res.status(501).send("couldn't delete order" + error);
          } else {
              res.json(commande);
          }
      }
  );
});

app.delete("/dashboard/clients/:id", (req, res) => {
  const client = req.params.id;
  connection.query(
      "DELETE FROM Users WHERE id= ?",
      [client],
      (error, results, fields) => {
          if (error) {
              res.status(501).send("couldn't delete client" + error);
          } else {
              res.json(client);
          }
      }
  );
});

app.get('/dashboard/orders', (req,res) => {

    /*
    let sqlQuerry = `
      SELECT 
        od.order_number, 
        us.firstname, 
        us.lastname, 
        ohs.date_status, 
        st.name     
      FROM Users AS us 
        JOIN Orders AS od ON od.client_id=us.id
        JOIN Orders_has_Status AS ohs ON ohs.orders_order_number = od.order_number
        JOIN Status AS st ON st.id=ohs.status_id
      `
    */

    
    let sqlQuerry = `
    SELECT 
      od.order_number, 
      us.firstname, 
      us.lastname    
    FROM Users AS us 
      JOIN Orders AS od ON od.client_id=us.id
    `
    

    if(req.query.order){
       sqlQuerry += ` 
        ORDER BY ${req.query.orderby} ${req.query.order} 
        LIMIT ${req.query.limit} 
        OFFSET ${req.query.offset}`;
    }

    console.log('sqlQuerry :', sqlQuerry)

    connection.query(sqlQuerry, (err, results) => {
        if (err) {
            res.status(500).send(`Error retrieving orders! err: ${err}`);
          } else {
            res.json(results);
          }
    });
})


app.get('/dashboard/orders/:id', (req, res) => {

  if(req.params.id === 'count'){
    let sqlQuerry = `
      SELECT count(*) AS cpt
      FROM Orders`;

    connection.query(sqlQuerry, (err, results) => {
        if (err) {
            res.status(500).send(`Error retrieving orders! err: ${err}`);
          } else {
            res.json(results);
          }
    });
  }
  else {
    const resultOrderSelected = {}
    const orderID = req.params.id

    // Query of front state: orderInformation
    const sqlOrder = `
    SELECT 
      Orders.order_number,
      Orders.delivery_comment
    FROM Orders
    WHERE Orders.order_number = ?
    `

    connection.query(sqlOrder, orderID, (err, results) => {
      if (err) {
        res.status(500).send(`Erreur lors de la récupération des information de la commande ${orderID}`);
      }
      if (results.length === 0) {
        return res.status(404).send('Order not found');
      }

      resultOrderSelected.orderInformation = {...results[0]};


      // Query of front state: clientAdress
      const sqlClient = `
      SELECT 
        Users.lastname,
        Users.firstname,
        Users.mail, 
        Users.GSM
      FROM Users
        JOIN Orders ON Orders.client_id = Users.id
      WHERE Orders.order_number = ?
      `

      connection.query(sqlClient, orderID, (err, results) => {
        if (err) {
          res.status(500).send(`Erreur lors de la récupération des informations du client de la commande ${orderID}`);
        }
        if (results.length === 0) {
          return res.status(404).send('Order not found');
        }

        resultOrderSelected.clientAdress = {...results[0]};


        // Query of front state: clientAdress.primary_adress
        const sqlAdressClient = `
        SELECT 
          Adress.adress,
          Adress.street_number, 
          Adress.zip_code, 
          Adress.city
        FROM Adress
          JOIN Users ON Users.primary_adress_id = Adress.id
          JOIN Orders ON Orders.client_id = Users.id
        WHERE Orders.order_number = ?
        `

        connection.query(sqlAdressClient, orderID, (err, results) => {
          if (err) {
            res.status(500).send(`Erreur lors de la récupération des informations de l'adresse du client de la commande ${orderID}`);
          }
          if (results.length === 0) {
            return res.status(404).send('Order not found');
          }

          resultOrderSelected.clientAdress.primary_adress = {...results[0]};


          // Query of front state: pharmacistAdress
          const sqlPharmacist = `
          SELECT 
            Users.lastname,
            Users.firstname,
            Users.mail, 
            Users.GSM
          FROM Users
            JOIN Orders ON Orders.pharmacist_id = Users.id
          WHERE Orders.order_number = ?
          `

          connection.query(sqlPharmacist, orderID, (err, results) => {
            if (err) {
              res.status(500).send(`Erreur lors de la récupération des informations de l'adresse du client de la commande ${orderID}`);
            }
            if (results.length === 0) {
              return res.status(404).send('Order not found');
            }
            
            resultOrderSelected.pharmacistAdress = {...results[0]};


            // Query of front state: pharmacistAdress.primary_adress
            const sqlAdressPharmacist = `
            SELECT 
              Adress.adress,
              Adress.street_number, 
              Adress.zip_code, 
              Adress.city
            FROM Adress
              JOIN Users ON Users.primary_adress_id = Adress.id
              JOIN Orders ON Orders.pharmacist_id = Users.id
            WHERE Orders.order_number = ?
            `

            connection.query(sqlAdressPharmacist, orderID, (err, results) => {
              if (err) {
                res.status(500).send(`Erreur lors de la récupération des informations de l'adresse du client de la commande ${orderID}`);
              }
              if (results.length === 0) {
                return res.status(404).send('Order not found');
              }
    
              resultOrderSelected.pharmacistAdress.primary_adress = {...results[0]};


              // Query of front state: clientAdress.secondary_adress
              const sqlSecondaryAdressClient = `
              SELECT 
                Adress.adress,
                Adress.street_number, 
                Adress.zip_code, 
                Adress.city
              FROM Adress
                JOIN Users ON Users.secondary_adress_id = Adress.id
                JOIN Orders ON Orders.client_id = Users.id
              WHERE Orders.order_number = ?
              `

              connection.query(sqlSecondaryAdressClient, orderID, (err, results) => {
                if (err) {
                  res.status(500).send(`Erreur lors de la récupération des informations de l'adresse du client de la commande ${orderID}`);
                }
                
                if (results.length === 0) {
                  resultOrderSelected.clientAdress.secondary_adress = {
                    adress: '',
                    street_number: '',
                    zip_code: '',
                    city: ''
                  }

                  //return res.status(404).send('Order not found');
                }
                else{
                  resultOrderSelected.clientAdress.secondary_adress = {...results[0]};
                }
                
                console.log('RESULT FINAL: ', resultOrderSelected)
      
                return res.json([resultOrderSelected]);
              });

            });
            
          });

        });

      });

    });
  }
});





app.get('/dashboard/orders/:id/pharmaceuticals', (req, res) => {

  const sql = `
  SELECT 
    ph.name, 
    ohp.quantity, 
    ph.price, 
    ph.category 
  FROM Orders AS od
    JOIN Orders_has_Pharmaceuticals AS ohp ON ohp.orders_order_number = od.order_number
    JOIN Pharmaceuticals AS ph ON ph.id_medicament = ohp.pharmaceuticals_id_medicament
  WHERE od.order_number = ?
  `

  const orderID = req.params.id

  connection.query(sql, orderID, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des commandes');
    }
    if (results.length === 0) {
      return res.status(404).send('Order not found');
    }
    return res.json(results);
  });

});

app.get('/dashboard/orders/:id/status', (req, res) => {

  const sql = `
  SELECT
    st.name AS status,
    ohs.date_status AS date_status
  FROM Orders
    JOIN Orders_has_Status AS ohs ON ohs.orders_order_number = Orders.order_number
    JOIN Status AS st ON st.id = ohs.status_id
  WHERE Orders.order_number = ?
  `

  const orderID = req.params.id

  connection.query(sql, orderID, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des status de la commande');
    }
    if (results.length === 0) {
      return res.status(404).send('Order not found');
    }
    return res.json(results);
  });

});

app.get('/dashboard/orders/:id/prescription', (req, res) => {

  const sql = `
  SELECT
    prescription
  FROM Orders
  WHERE Orders.order_number = ?
  `

  const orderID = req.params.id

  connection.query(sql, orderID, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des status de la commande');
    }
    if (results.length === 0) {
      return res.status(404).send('Order not found');
    }
    return res.json(results);
  });

});

app.get('/dashboard/orders/:id/currentstatus', (req, res) => {

  const sql = `
  SELECT
    st.name AS status,
    ohs.date_status
  FROM Orders
    JOIN Orders_has_Status AS ohs ON ohs.orders_order_number = Orders.order_number
    JOIN Status AS st ON st.id = ohs.status_id
  WHERE Orders.order_number = ?
  ORDER BY ohs.date_status desc 
  LIMIT 1 
  `
  
  const orderID = req.params.id

  connection.query(sql, orderID, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des status de la commande');
    }
    if (results.length === 0) {
      return res.status(404).send('Order not found');
    }
    console.log('Result: ', results)
    return res.json(results);
  });

});



app.get('/dashboard/clients', (req,res) => {

  let sqlQuerry = `
    SELECT 
      lastname, 
      firstname, 
      GSM, 
      zip_code, 
      city,
      us.id
    FROM Users AS us
      JOIN Adress AS ad ON ad.id=us.primary_adress_id
      JOIN Roles AS ro ON ro.id=us.roles_id     
    WHERE ro.role = 'Client'
  `;
  

  if(req.query.order){
     sqlQuerry += ` 
      ORDER BY ${req.query.orderby} ${req.query.order} 
      LIMIT ${req.query.limit} 
      OFFSET ${req.query.offset}`;
  }


  connection.query(sqlQuerry, (err, results) => {
      if (err) {
          res.status(500).send(`Error retrieving orders! err: ${err}`);
        } else {
          res.json(results);
        }
  });
})

app.get('/dashboard/clients/:id', (req, res) => {

  if(req.params.id === 'count'){
    const sqlQuerry = `
      SELECT count(*) AS cpt
      FROM Users`;

    connection.query(sqlQuerry, (err, results) => {
        if (err) {
            res.status(500).send(`Error retrieving orders! err: ${err}`);
          } else {
            res.json(results);
          }
    });
  }
  else {
    const sql =
      `SELECT 
        lastname, 
        firstname, 
        mail, 
        GSM, 
        date_inscription, 
        national_registration_number,
        zip_code,
        adress,
        city,
        street_number,
        secondary_adress_id
      FROM Users AS us
        JOIN Adress AS ad ON ad.id = us.primary_adress_id
        JOIN Roles AS ro ON ro.id = us.roles_id
      WHERE us.id = ?
      AND ro.role = 'client'`

    const ClientsID = req.params.id

    
    connection.query(sql, ClientsID, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des clients');
      }
      if (results.length === 0) {
        return res.status(404).json({ 
            error_message: "client non trouvé", 
            sql_error: err,
            sql_result: results});
      }
      return res.json(results);
    });
  }
});

app.get('/dashboard/clients/:id/secondary_adress', (req, res) => {

  const sql =
    `SELECT 
      zip_code,
      adress,
      city,
      street_number
    FROM Adress AS ad 
      JOIN Users AS us ON us.secondary_adress_id = ad.id 
    WHERE us.id = ?`

  const ClientsID = req.params.id

  connection.query(sql, ClientsID, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des clients');
    }
    if (results.length === 0) {
      return res.status(404).json({ 
          error_message: "adresse non trouvée", 
          sql_error: err,
          sql_result: results});
    }
    return res.json(results);
  });
});



app.post('/dashboard/clients/:id_client/secondary_adress', (req, res) => {

  console.log("secondary_adress: ", req.body);
  console.log("id selected client: ", req.params.id_client);

  const sql =
    `INSERT INTO 
      Adress (
        zip_code, 
        adress, 
        city, 
        street_number) 
    VALUES 
    ('${req.body.zip_code}', 
    '${req.body.adress}', 
    '${req.body.city}', 
    '${req.body.street_number}');`

  connection.query(sql, (err, results) => {
    if (err) {
      console.log('Error of INSERT secondary adress: ', err);
      res.status(500).json({ 
        error_message: "Erreur lors de l'ajout d'une adresse secondaire pour le client", 
        id_client: req.params.id_client,
        sql_error: err.sqlMessage})
    }
    else{
      console.log('Results ID of INSERT secondary adress:', results);
      const id_secondary_adress = results.insertId

      const sql = `
        UPDATE 
          Users 
        SET 
          secondary_adress_id='${id_secondary_adress}' 
        WHERE 
          id='${req.params.id_client}';`

      connection.query(sql, (err, results) => {
        if (err) {
          console.log('Error of UPDATE secondary adress IN User table: ', err);
          res.status(500).json({ 
            error_message: "Erreur lors de la mise a jour de l'adresse secondaire du client", 
            id_client: req.params.id_client,
            sql_error: err.sqlMessage})
        }
        else{
          console.log('Results of UPDATE secondary adress IN User table: ', results)
          res.status(200).json({
            message: "Adresse de livraison correctement enregistré",
            sql_result: results});
        }
      });
    }
  });
})

app.post('/dashboard/clients', (req, res) => {

  console.log("New client: ", req.body);

  
  const sql =
    `INSERT INTO 
      Adress (
        zip_code, 
        adress, 
        city, 
        street_number) 
    VALUES 
    ('${req.body.primary_adress.zip_code}', 
    '${req.body.primary_adress.adress}', 
    '${req.body.primary_adress.city}', 
    '${req.body.primary_adress.street_number}');`
  
  connection.query(sql, (err, results) => {
    if (err) {
      console.log('Error of INSERT primary adress of POST new client: ', err);
      res.status(500).json({ 
        error_message: "Erreur lors de l'ajout de l'adresse pendant le POST new client", 
        sql_error: err.sqlMessage})
    }
    else{
      console.log('Results ID of INSERT primary adress of POST new client: ', results.insertId);
      const id_primary_adress = results.insertId

      const sql = `
      INSERT INTO 
      Users (
        lastname, 
        firstname, 
        mail, 
        GSM,
        roles_id,
        primary_adress_id,
        national_registration_number) 
      VALUES 
      ('${req.body.lastname}', 
      '${req.body.firstname}', 
      '${req.body.mail}', 
      '${req.body.GSM}',
      1,
      ${id_primary_adress},
      '${req.body.national_registration_number}');`

      connection.query(sql, (err, results) => {
        if (err) {
          console.log('Error of UPDATE secondary adress IN User table: ', err);
          res.status(500).json({ 
            error_message: "Erreur lors de l'ajout d'un nouveau client", 
            id_client: req.params.id_client,
            sql_error: err.sqlMessage})
        }
        else{
          console.log('Results of UPDATE secondary adress IN User table: ', results)
          res.status(200).json({
            message: "Nouveau client correctement enregistré",
            sql_result: results});
        }
      });
    }
  });
})




app.use(function(req, res, next) {
    var  err  =  new  Error('Not Found');
    err.status  =  404;
    next(err);
});

app.listen( port, function(){
  console.log(`Server is listening on ${port}`);
});