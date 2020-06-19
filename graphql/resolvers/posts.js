const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../controllers/user-middleware-controller');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {

      // THIS IS THE PROBLEM!!! GOOGLE USER IS NOT GOING THROUGH MIDDLEWARE JWT-USER-CONTROLLER.JS
      const user =  await checkAuth(context);
      console.log('posts.js user: ', user)

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        name: user.name || user.profileObj.name,
        picture: user.picture,
        relation: user.relation,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user =  await checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.name || user.profileObj.name === post.name || post.profileObj.name) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { name } =  await checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.name || like.profileObj.name === name)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.name || like.profileObj.name !== name);
        } else {
          // Not liked, like post
          post.likes.push({
            name,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
};