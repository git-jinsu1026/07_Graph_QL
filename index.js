const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

    input ProductInput {
        name : String
        price : Int
        description : String
    }

    type Product{
        id: ID!
        name: String
        price : Int
        description : String
    }

    type Query {
        getProduct(id : ID!): Product ,
    }

    type Mutation {
        addProduct( input : ProductInput ) : Product
        updateProduct(id: ID! , input: ProductInput!) : Product
        deleteProduct(id:ID!): String
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
            product.id === parseInt(id)),

    addProduct: ({ input }) => {
        //임시변수에 id값을 +1 해서 데이터를 추가하겠다.
        input.id = parseInt(products.length + 1);
        //입력받은 데이터를 추가하겠다.
        products.push(input);
        //재활용 
        return root.getProduct({ id: input.id });
    },


    //인덱싱값을 알아야한다
    updateProduct: ({ id, input }) => {
        const index = products.findIndex(product => product.id === parseInt(id))
        products[index] = {
            id: parseInt(id),
            ...input
        }
        return products[index];
    },

    deleteProduct: ({ id }) => {
        const index = products.findIndex(product => product.id === parseInt(id))
        products.splice(index, 1)
        return '성공'
    }
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


//추가
// {
//     "query": "mutation updateProduct( $id : ID! , $input: ProductInput! ) { updateProduct( id : $id  , input: $input) { id } }",
//     "variables": { "id" : 1 ,"input" : { "name" : "수정상품" , "price" : 1000 , "description" : "후후후" } }
// }


//수정
// {
//     "query": "mutation updateProduct( $id : ID! , $input: ProductInput! ) { updateProduct( id : $id  , input: $input) { id } }",
//     "variables": { "id" : 1 ,"input" : { "name" : "수정상품" , "price" : 1000 , "description" : "후후후" } }
// }