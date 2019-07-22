import React from 'react';
import { graphql } from 'gatsby';
import Page from '../components/page';

export const query = graphql`
  query($slug: String!) {
    file(fields: { slug: { eq: $slug } }) {
      childMdx {
        body
      }
    }
  }
`;

const Default = ({ data }) => {
  const page = {
    body: data.file.childMdx.body
  };
  return <Page {...page} />;
};

export default Default;
