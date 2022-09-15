const { Client } = require("@notionhq/client")

const notion = new Client({auth: process.env.NOTION_API_KEY})


async function getDatabase(){
    const response = await notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID, 

    })
    console.log(response )
}
// getDatabase()

async function queryDatabase(){
    const pain = await notion.databases.query({database_id: process.env.NOTION_DATABASE_ID,})

    for (let i=0; i<pain.results.length; i++){
        console.log(pain.results[i].properties.Description)
    }

}
// queryDatabase()

async function getTags(){
    const database = await notion.databases.retrieve({database_id: process.env.NOTION_DATABASE_ID,})

    // console.log(notionPropertiesById(database.properties))
    return notionPropertiesById(database.properties)[process.env.NOTION_TAGS_ID].multi_select.options.map(
        option => {
            return {id: option.id, name: option.name}
        }
    )
}

// getTags().then(res => console.log(res))

function notionPropertiesById(properties){
    return Object.values(properties).reduce((obj, property) => {
        const {id, ...rest} = property
        return {...obj, [id]: rest}
    }, {})
}

function createSuggestion({title, description, number, project, tags}){
    notion.pages.create({
        parent:{
            database_id: process.env.NOTION_DATABASE_ID
        },
        properties:{
            [process.env.NOTION_NAME_ID]:{
                title: [
                    {
                        type: 'text',
                        text:{
                            content: title
                        }
                    }
                ]
            },
            [process.env.NOTION_DESCRIPTION_ID]:{
                'rich_text':[
                    {
                        type: 'text',
                        text:{
                            content: description
                        }
                    }
                ]
            },
            [process.env.NOTION_PROPERTY_ID]:{
                'number': number
            },
            [process.env.NOTION_PROJECT_ID]:{
                "checkbox": project
            },
            [process.env.NOTION_TAGS_ID]: {
                multi_select: tags.map(tag => {
                    return {id: tag.id}
                })
            }
        }
    })
}

getTags().then(tags => {
    createSuggestion(
        {
            title: '4, 1', 
            description: 'very good', 
            number: 2291,
            project: true,
            tags: tags
        }
    )
})
// createSuggestion({title: '4, 1', description: 'very good', number: 2291, project: true, tags: getTags()})