"use server";

import fetch from "node-fetch";
import { PineconeClient } from "pinecone-client";

const apiKey = "a012ac3d-6ba2-4ab9-9853-8d1bce4784c0";
const indexName = "semantic-search";

const pineconeClient = new PineconeClient({
  apiKey: apiKey,
  baseUrl: "https://semantic-search-7uh8oyo.svc.gcp-starter.pinecone.io/",
});

export async function globalSearch(query: string) {
  const response = await fetch(
    "http://localhost:3000/embed_endpoint",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: query }),
    }
  );

  const embedding = await response.json();

  const searchResponse: any = await pineconeClient.query({
    vector: embedding,
    topK: 10,
    includeMetadata: true,
  });

  const clusters = searchResponse.matches
    .filter((result: any) => result.score > 0.3)
    .map((result: any) => ({
      cluster_id: result.metadata.cluster_id,
      excerpt: result.metadata.excerpt,
      relevance: result.score,
    }));

  console.log(clusters);

  return clusters;
}

export async function withinClusterSearch(query: string, clusterId: string) {
  const response = await fetch(
    "http://localhost:3000/embed_endpoint",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: query }),
    }
  );

  const embedding = await response.json();

  const searchResponse: any = await pineconeClient.query({
    vector: embedding,
    topK: 200,
    includeMetadata: true,
  });

  const clusters = searchResponse.matches
    .filter(
      (result: any) =>
        result.score > 0.2 && result.metadata.cluster_id == clusterId
    )
    .map((result: any) => ({
      cluster_id: result.metadata.cluster_id,
      excerpt: result.metadata.excerpt,
      relevance: result.score,
    }));

  if (clusters.length > 0) {
    return clusters[0].excerpt;
  } else {
    return null;
  }
}
