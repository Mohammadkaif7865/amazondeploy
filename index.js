let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors');
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 9870;
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
//let mongoUrl = process.env.MongoUrl;
let mongoUrl = process.env.MongoLiveUrl;
let db;

// middleware(supporting lib)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json());
//1 for checking is server is on or not
app.get('/', (req, res) => {
    res.send("Express server is running");
});
// * category for home page
app.get('/category', (req, res) => {
    db.collection("categories").find().toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

// * word filter 
app.get('/products_match/:word', (req, res) => {
    let data = req.params.word;
    let output = db.collection('products').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result.filter((item) => {
            return item.brand.toLowerCase().indexOf(data.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(data.toLowerCase()) > -1 || item.category.toLowerCase().indexOf(data.toLowerCase()) > -1 || item.sub_category.toLowerCase().indexOf(data.toLowerCase()) > -1;
        }));
    })
})
// * main search for all categories , name ,sub_category and description 
app.get('/products_match_with_sort/:word/:bit', (req, res) => {
    let data = req.params.word;
    let bit = Number(req.params.bit);
    let output = db.collection('products').find().sort({ cost: bit }).toArray((err, result) => {
        if (err) throw err;
        res.send(result.filter((item) => {
            return item.brand.toLowerCase().indexOf(data.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(data.toLowerCase()) > -1 || item.category.toLowerCase().indexOf(data.toLowerCase()) > -1 || item.sub_category.toLowerCase().indexOf(data.toLowerCase()) > -1;
        }));
    })
})
//2 to check each collection
app.get('/items/:collections', (req, res) => {
    db.collection(req.params.collections).find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
//3 to get data of particular product
app.get('/details/:id', (req, res) => {
    let id = Number(req.params.id)
    db.collection('products').find({ id: id }).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
// 4 to check all products
app.get('/products', (req, res) => {
    db.collection('products').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
//5. to check orderplaced collection
app.get('/orderplaced', (req, res) => {
    db.collection('orderplaced').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
//6 to check products on cart
app.get('/cartall', (req, res) => {
    db.collection('cart').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
//7 to check product on the basis or category
app.get('/products_on_category_basis', (req, res) => {
    let query = {}
    if (req.query.category && req.query.sub_category) {
        query = { category: req.query.category, sub_category: req.query.sub_category }
    } else if (req.query.category) {
        query = { category: req.query.category }
    } else if (req.query.sub_category) {
        query = { sub_category: req.query.sub_category }
    }
    db.collection('products').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
//8 to filter products on the basis of cost or category
app.get('/category_and_filter', (req, res) => {
    let query = {};
    let sort = { cost: 1 }; // # -1 for decent cost and 1 for ascending cost
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    if (req.query.category && req.query.sub_category) {
        query = { category: req.query.category, sub_category: req.query.sub_category, $and: [{ cost: { $gt: lcost, $lt: hcost } }] }
    } else if (req.query.category) {
        query = { category: req.query.category, $and: [{ cost: { $gt: lcost, $lt: hcost } }] }
    } else if (req.query.sub_category) {
        query = { sub_category: req.query.sub_category, $and: [{ cost: { $gt: lcost, $lt: hcost } }] }
    }
    db.collection('products').find(query).sort(sort).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    });
});
//9 to placeorder
app.post('/placeOrder', (req, res) => {
    db.collection('orderplaced').insertMany(req.body, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
//10 to delete order
app.delete('/deleteOrder/:id', (req, res) => {
    let oid = mongo.ObjectId(req.params.id)
    db.collection('orderplaced').remove({ _id: oid }, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
// # favourities add ,remove and get
// * add to fav
app.post('/favourities', (req, res) => {
    db.collection('amazonfav').insertMany(req.body, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})
// * all the favourities of a email address
app.get('/userfav/:email', (req, res) => {
    db.collection('amazonfav').find({ email: req.params.email }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
// * spacific in the favourities
app.get('/spacific', (req, res) => {
    db.collection('products').find({ id: { $in: req.body.items } }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
    // res.send(req.body);
})
// * delete a favourities of a email address
app.delete('/deletefav/:email/:id', (req, res) => {
    db.collection('amazonfav').deleteOne({ email: req.params.email, itemId: Number(req.params.id) }, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})
// # addto cart , remove from cart 
// * add to cart
app.get('/cart/:email', (req, res) => {
    db.collection('cart').find({ email: req.params.email }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
});
app.post('/addcart', (req, res) => {
    db.collection('cart').insertMany(req.body, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
// * delete form cart
app.delete('/deleteFromCart/:email/:id', (req, res) => {
    db.collection('cart').deleteOne({ email: req.params.email, itemId: Number(req.params.id) }, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})
// * Connection with db
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) console.log(`Error While Connecting`);
    db = client.db('Amazon');
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`Express Server listening on port ${port}`);
    });
});