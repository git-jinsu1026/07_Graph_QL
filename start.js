//쿼리 작성 데이터구조

const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query{
        hello:String,
        nodejs : Int,
    }
`)

const root = {
    hello: () => 'hello world',
    nodejs: () => 20
}

graphql(schema, '{nodejs}', root)
    .then((response) => {
        console.log(response)
    })

/*
 쿼리를 hello로 만들고, 응답은 String으로


 */