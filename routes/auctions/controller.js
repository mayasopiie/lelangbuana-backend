const models = require('../../models')
const auction = models.auction

const controller = {
    
    //-------------------------------------------------------------------------------------------
    get: (req, res, next) => {
        auction
            .findAll()
            .then(auctions => {
                if (auctions.length == 0) {
                    res.status(400).send({
                        message: 'Sorry, your data is empty.'
                    })
                    console.log('Sorry, auction data is empty.')
                }
                else if (auctions.length > 0){
                    res.send(auctions)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    post: (req, res, next) => {
        const {
            user_id,
            title,
            item_condition,
            item_description,
            quantity,
            start_bid,
            max_bid,
            min_bid,
            bids_multiply,
            start_date,
            end_date,
            item_photo,
            status
        } = req.body;
        if (
            user_id &&
            title &&
            item_condition &&
            item_description &&
            quantity &&
            start_bid &&
            max_bid &&
            min_bid &&
            bids_multiply &&
            start_date &&
            end_date &&
            item_photo &&
            status
        ){
            auction
                .create({
                    user_id,
                    title,
                    item_condition,
                    item_description,
                    quantity,
                    start_bid,
                    max_bid,
                    min_bid,
                    bids_multiply,
                    start_date,
                    end_date,
                    item_photo,
                    status,
                    created_at: new Date()
                })
                .then(newAuction => {
                    res.send(newAuction)
                    console.log('You have sent a new auction data!')
                })
                .catch(error => {
                    res.status(400).send({error})
                })
        }
        else{
            res.status(400).send({message: 'You must fill every field!'})
            console.log('You must fill every field!')
        }
    },

    //-------------------------------------------------------------------------------------------
    getById: (req, res, next) => {
        const { auction_id } = req.params
        auction
            .findOne({
                where:{
                    auction_id
                }
            })
            .then(auctionData => {
                if (!auctionData){
                    res.status(400).send({message: 'Sorry, your data is empty.'})
                    console.log('Sorry, auction data is empty.')
                }
                else{
                    res.send(auctionData)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    getByUserId: (req, res, next) => {
        const { user_id } = req.params
        auction
            .findAll({
                where:{
                    user_id
                }
            })
            .then(auctionData => {
                if (auctionData.length == 0) {
                    res.status(400).send({
                        message: 'Sorry, your data is empty.'
                    })
                    console.log('Sorry, auction data is empty.')
                }
                else{
                    res.send(auctionData)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    getByStatus: (req, res, next) => {
        const { status } = req.params
        auction
            .findAll({
                where:{
                    status
                }
            })
            .then(auctionData => {
                if (auctionData.length == 0) {
                    res.status(400).send({
                        message: 'Sorry, your data is empty.'
                    })
                    console.log('Sorry, auction data is empty.')
                }
                else{
                    res.send(auctionData)
                    console.log('Yeah! You have some auction data!')
                }
            })
            .catch(error => {
                res.status(400).send({
                    error
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    updateAuction: (req, res, next) => {
        const { auction_id } = req.params
        auction.update({
                user_id: req.body.user_id,
                title: req.body.title,
                item_condition: req.body.item_condition,
                item_description: req.body.item_description,
                quantity: req.body.quantity,
                start_bid: req.body.start_bid,
                max_bid: req.body.max_bid,
                min_bid: req.body.min_bid,
                bids_multiply: req.body.bids_multiply,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                item_photo: req.body.item_photo,
                status: req.body.status,
                created_at: new Date()
            }, {
                where: {
                    auction_id
                }
            })
            .then(bid => {
                res.send({
                    bid
                })
            })
            .catch(err => {
                res.status(400).send({
                    message: 'Update bid failed'
                })
            })
    },

    //-------------------------------------------------------------------------------------------
    deleteAuction: (req, res, next) => {
        const { auction_id } = req.params
        auction.destroy({
                where: {
                    auction_id
                }
            })
            .then(auction => {
                res.send({
                    auction
                });
            })
            .catch(err => {
                res.status(400).send({
                    message: 'Delete auction failed'
                })
            })
    }
}

module.exports = controller