const express = require('express');
const mainController = require('../controllers/main');

const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
/*********** REGISTER ***********/
router.get('/users/register', mainController.register);
router.post('/users/register', mainController.processRegister);
/*********** LOGIN ***********/
router.get('/users/login', mainController.login);
router.post('/users/login', mainController.processLogin);
/*********** LOGOUT ***********/
router.get('/users/logout', mainController.logout);
/*********** DELETE ***********/
router.delete('/books/:id', mainController.deleteBook);
/*********** EDIT ***********/
router.get('/books/edit/:id', mainController.edit);
router.put('/books/edit/:id', mainController.processEdit);

module.exports = router;
