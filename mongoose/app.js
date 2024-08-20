/* Install express by writing command
npm install express in terminal 

Install mongoose
 by writing command npm i mongoose in terminal*/


 const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

mongoose.connect('mongodb+srv://nitishbhatnagar3000:NOeRMmWkQJKAdDbM@cluster0.y3xy3.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

const userSchema = new mongoose.Schema({
    name: String,
    price: Number,
    size: String,
    category: String,

});
const User = mongoose.model('User', userSchema);
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.set('view engine','ejs');




app.get('/pizzas/new' , (req,res)=>{
    res.render('new-user',{errors:null})
})



app.get('/pizzas', async (req, res) => {
    try {
        const pizzas = await User.find();
        res.render('user-list', {pizzas});

    } catch (err) {
        res.status(500).send(err);
    }
});

//To retrieve a single pizza by using ID


app.get('/pizzas/:id/edit', async (req, res) => {
    try {
        const pizza = await User.findById(req.params.id);//To retrieve sungle pizza we write pizza not pizzas
        if (!pizza) {
            return res.status(404).send('Pizza not found');
        }
        res.render('edit-user', {pizza,errors:null});

    } catch (err) {
        res.status(500).send(err);
    }
});



//To delete a particular pizza by using ID


app.delete('/pizzas/:id', async (req, res) => {
    try {
        const pizza = await User.findByIdAndDelete(req.params.id);//To retrieve sungle pizza we write pizza not pizzas
        if (!pizza) {
            return res.status(404).send('Pizza not found');
        }

        res.redirect("/pizzas");
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a particular pizza by using ID
app.put('/pizzas/:id', async (req, res) => {
    try {
        const pizza = await User.findByIdAndUpdate(req.params.id , req.body, { new: true });//To retrieve sungle pizza we write pizza not pizzas
        if (!pizza) {
            return res.status(404).send('Pizza not found');
        }

        res.redirect("/pizzas");
        } catch (err) {
        res.status(500).send(err);
    }
});



// Create a particular pizza 
app.post('/pizzas', async (req, res) => {
    try {
        const pizza = new User(req.body);
        await pizza.save()
        res.redirect("/pizzas");
        } catch (err) {
        res.status(500).send(err);
    }
});










    const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

