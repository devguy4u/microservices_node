import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";
import { xml2json } from "xml-js";
import { safeDump } from "js-yaml";
import { writeGitHubFile } from "../helpers/github";

export default async (req: NowRequest, res: NowResponse) => {
  try {
    const response = await axios.get(
      `https://www.goodreads.com/review/list/6784560.xml?shelf=read&key=${process.env.GOODREADS_KEY}&v=2`,
      {
        responseType: "text"
      }
    );
    const json = JSON.parse(xml2json(response.data));
    const books = json.elements[0].elements[2].elements;
    const result = [];
    for (const book of books) {
      let thisBook: any = {};
      const bookDetails = book.elements.filter(i => i.name === "book")[0]
        .elements;
      try {
        const isbn = bookDetails.filter(i => i.name === "isbn")[0].elements[0]
          .text;
        thisBook.isbn = isbn;
      } catch (error) {}
      try {
        const isbn13 = bookDetails.filter(i => i.name === "isbn13")[0]
          .elements[0].text;
        thisBook.isbn13 = isbn13;
      } catch (error) {}
      try {
        const title = bookDetails.filter(i => i.name === "title")[0].elements[0]
          .text;
        thisBook.title = title;
      } catch (error) {}
      try {
        const image_url = bookDetails.filter(i => i.name === "image_url")[0]
          .elements[0].text;
        thisBook.image_url = image_url;
      } catch (error) {}
      try {
        const image_url = bookDetails.filter(i => i.name === "image_url")[0]
          .elements[0].text;
        thisBook.image_url = image_url;
      } catch (error) {}
      try {
        const link = bookDetails.filter(i => i.name === "link")[0].elements[0]
          .text;
        thisBook.link = link;
      } catch (error) {}
      try {
        const publisher = bookDetails.filter(i => i.name === "publisher")[0]
          .elements[0].text;
        thisBook.publisher = publisher;
      } catch (error) {}
      try {
        const authors = bookDetails.filter(i => i.name === "authors")[0]
          .elements[0].elements[1].elements[0].text;
        thisBook.author = authors;
      } catch (error) {}
      try {
        const rating = book.elements.filter(i => i.name === "rating")[0]
          .elements[0].text;
        thisBook.rating = rating;
      } catch (error) {}
      try {
        const dateAdded = book.elements.filter(i => i.name === "date_added")[0]
          .elements[0].text;
        thisBook.dateAdded = dateAdded;
      } catch (error) {}
      try {
        const startedAt = book.elements.filter(i => i.name === "started_at")[0]
          .elements[0].text;
        thisBook.startedAt = startedAt;
      } catch (error) {}
      try {
        const readAt = book.elements.filter(i => i.name === "read_at")[0]
          .elements[0].text;
        thisBook.readAt = readAt;
      } catch (error) {}
      try {
        const url = book.elements.filter(i => i.name === "url")[0].elements[0]
          .cdata;
        thisBook.url = url;
      } catch (error) {}
      result.push(thisBook);
    }
    await writeGitHubFile(
      "AnandChowdhary/life-data",
      "books.yml",
      "📘 Update Goodreads books",
      safeDump(result)
    );
    res.json({ done: true });
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ error });
  }
};