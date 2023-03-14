const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Sequelize } = require("../database/models");
const Op = Sequelize.Op;

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },

  bookDetail: (req, res) => {
    // Implement look for details in the database
    db.Book.findByPk(req.params.id, {include: [{association: 'authors'}]})
      .then((book) => {
        res.render('bookDetail', { book });
      })
      .catch((error) => console.log(error));
  },

  bookSearch: (req, res) => {
    res.render("search", { books: [] , message: req.session.message});
  },

  bookSearchResult: (req, res) => {
    let keyword = req.body.title;
    console.log(keyword);
    if (keyword.length == 0) {
      res.render("search", { books: [] , message: req.session.message });
    }
    db.Book.findAll({
      include: [{ association: "authors" }],
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      },
    })
      .then((books) => {
        res.render("search", { books, message: req.session.message });
      })
      .catch((error) => console.log(error));
  },

  deleteBook: (req, res) => {
    // Implement delete book
    db.Book.destroy(
      {
        where: {id: req.params.id}
      }
    )
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => console.log(error))
  },

  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },

  authorBooks: (req, res) => {
    // Implement books by author
    db.Author.findByPk(req.params.id, {include: [{association: 'books'}]
  })
  .then((author) => {
    res.render('authorBooks', { author });
  })
    .catch((error) => console.log(error));
  },

  register: (req, res) => {
    res.render('register');
  },

  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcrypt.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },

  login: (req, res) => {
    res.render('login');
  },

  processLogin: (req, res) => {
    db.User.findOne(
      {
        where: 
        { email: req.body.email}
      }
    )
    .then((userLogin) => {
      console.log(userLogin)
      if(userLogin){
        let okPass = bcryptjs.compareSync(req.body.password, userLogin.Pass)
        if (okPass) {
          delete userLogin.password
          req.session.userLogged = userLogin
          if(req.body.email.length != 0){
            res.cookie("usuario", userLogin.email)
          }
          return res.redirect('/')
        }
        return res.render('users/login', { tittle:'Login',
                                  errors:{
                                    password:{
                                      msg:'Credenciales invalidas - password'
                                    }
                                  }
                        })
      }
      return res.render('users/login.ejs',{ tittle:'Login',
      errors:{
        email:{
          msg:'Credenciales invalidas - email '
        }
      }
      })
    })
  },

  logout: (req,res) => {
    req.session.destroy()
    res.redirect('/')
  },
  
  edit: (req, res) => {
    db.Book.findByPk(req.params.id)
    .then((book) => {
      res.render('editBook', { book: book, id: req.params.id })
    })
    .catch((error) => console.log(error));
  },

  processEdit: (req, res) => {
    db.Book.update(
    {
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.description     
    }, 
    { 
      where: { id: req.params.id }
    })
    .then(() => { res.redirect('/') 
    })
    .catch((error) => console.log(error));
  },
}

module.exports = mainController;
