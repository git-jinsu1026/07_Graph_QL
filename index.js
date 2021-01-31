const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

    type Product{
        id: ID!
        name: String
        price : Int
        description : String
    }

    type Query {
        getProduct(id : ID!): Product
    }
`);

//임시데이터
const products = [
    {
        id: 1,
        name: '첫번째 제품',
        price: 2000,
        description: '맵다'
    },
    {
        id: 2,
        name: '두번째 제품',
        price: 4000,
        description: '짜다'
    }
]
//임시데이터



const root = {
    getProduct: ({ id }) => products.
        find(product =>
            product.id === parseInt(id))
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,//이것을 true로해서 그래프큐엘 서버를 들어갔을 때 나타난다.
}));

app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
});  