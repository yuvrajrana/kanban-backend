export const typeDefs = `#graphql
  enum Priority {
    HIGH
    MEDIUM
    LOW
  }
input ColumnInput {
  name: String!
  wipLimit: Int
}

  type Board {
    _id: ID!
    name: String!
    description: String
    columns: [Column!]!
    tasks: [Task!]
    
  }

  type Column {
    _id: ID!
    name: String!
    wipLimit:Int
  }


  type User {
    _id: ID!
    name: String!
    email: String!
    shortName: String!
    avatarColor: String!
    boards: [Board!]!
  }

  type AssignedTo {
  _id:ID!
  name: String!
  avatarColor: String!
  email: String
  shortName: String
  }

type Task {
  _id: ID!
  title: String!
  assignedTo: AssignedTo
  boardId: ID!
  board: Board!        
  priority: Priority!
  createdAt: String!
  updatedAt: String!
  order: Int
  columnId: ID!
  columnName:String!
  description: String
  column: Column
}

  type Query {
    boards: [Board!]!
    board(id: ID!): Board
    users: [User!]!
    user(id: ID!): User
  }
    

  type Mutation {


    createBoard(name: String!, description: String!, columns: [ColumnInput!]!): Board!
    updateBoard(id: ID!, name: String, description: String): Board!
    deleteBoard(id: ID!): Boolean!

    createTask(
      title: String!
      columnName: String!
      columnId: ID!
      boardId: ID!
      priority: Priority!
      order: Int
      userId: ID
    ): Task!

    updateTask(
      id: ID!
      title: String
      columnName: String
      boardId: ID
      priority: Priority
      order: Int
    ): Task!

    deleteTask(id: ID!): Boolean!

    updateTaskColumn(taskId: ID!, columnName: String!, order: Int): Task!
  }
`;
