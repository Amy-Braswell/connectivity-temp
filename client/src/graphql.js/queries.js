import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      name
      picture
      relation
      likeCount
      likes {
        username
        name
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      name
      picture
      relation
      likeCount
      likes {
        username
        name
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const FETCH_USERS_QUERY = gql`
  {
    getUsers {
    id
    name
    username
    about
    city
    state
    relation
    email
    picture
    token
    createdAt
    }
  }
`;

export const FETCH_USER_QUERY = gql`
  query($userId: ID!) {
    getUser(userId: $userId) {
    id
    username
    name
    about
    city
    state
    relation
    email
    picture
    createdAt
    }
  }
`;


 export const FETCH_FOLDERS_QUERY = gql`
  {
    getFolders {
    id
    name
    createdAt
    }
  }
  `;

export const FETCH_FOLDER_QUERY = gql`
query($folderId: ID!) {
  getFolder(folderId: $userId) {
  id
  name
  createdAt
  }
}
`;



export const FETCH_PHOTOS_QUERY = gql`
  {
    getPhotos {
      id
      image
      createdAt
      folder{
        name
        createdAt
      }
    }
  }
`;

export const FETCH_PHOTO_QUERY = gql`
  query($photoId: ID!) {
    getPhoto(photoId: $photoId) {
      id
      image
      createdAt
      folder{
        name
        createdAt
      }
    }
  }
`;




export const ME_QUERY = `
{
  me {
    id
    name
    email
    picture
  }
}
`

