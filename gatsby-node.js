const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    query {
      allFile {
        nodes {
          fields {
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(`Error loading theme mdx files`, result.errors);
  }

  result.data.allFile.nodes.forEach(node => {
    actions.createPage({
      path: node.fields.slug,
      component: require.resolve('./src/templates/default.js'),
      context: { slug: node.fields.slug }
    });
  });
};

exports.onCreateNode = ({ node, actions }, options) => {
  if (node.internal.type !== 'File') {
    return;
  }

  const { createNodeField } = actions;
  const toPostPath = node => {
    const { dir } = path.parse(node.relativePath);
    const basePath = options.basePath || '/';
    return path.join(basePath, dir, node.name);
  };

  const slug = toPostPath(node);

  createNodeField({ name: 'slug', node, value: slug });
};

exports.onPreBootstrap = ({ store }, options) => {
  const { program } = store.getState();
  const basePath = options.basePath || 'content';
  const dir = path.join(program.directory, basePath);

  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  fs.writeFile(path.join(dir, 'first-blog.mdx'), '# My First Blog', function(
    err
  ) {
    if (err) throw err;
  });
};
