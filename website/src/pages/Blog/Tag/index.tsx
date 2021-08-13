import React, { useEffect, useState } from "react";
import useStyles from "./styles";
import { useTranslation } from "react-i18next";
import {
  Container,
  Grid
} from "@material-ui/core";
import Footer from "../../../components/Footer";
import { METADATA_TYPES } from "../../../constants";
import Sponsor from "../../../components/Sponsor";
import Pagination from "@material-ui/lab/Pagination";
import { pageCount } from "../../../utils/getPageCount";
import SeoJson from "../../../resources/seo.json";
import { useCurrentHost } from "../../../hooks/useCurrentHost";
import { Metadata } from "../../../components/Metadata";
import BlogCard from "../../../components/BlogCard";
import { useTag } from "../../../hooks/extractBlogPath";
import { useHistory } from "react-router-dom";

interface blogObject { 
  title: string;
  author: string;
  excerpt: string;
  author_info: string;
  date: string;
  tags: Array<string>;
  content: string;
  id: number;
  slug: string; 
}

const Tag: React.FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { currentOrigin } = useCurrentHost();
  const [filteredData, setFilteredData] = useState<blogObject[]>([
    { title: "",
      author: "",
      excerpt: "",
      author_info: "",
      date: "",
      tags: [],
      content: "",
      id: 0,
      slug: "" }
  ]);
  const selectedTag = useTag();
  const itemsPerPage = 6;
  const [page, setPage] = React.useState<number>(1);
  const history = useHistory();

  const fetchBlogs = async () => {
    const { default: blogs } = await import(`../../../posts.json`);
    const filteredData = blogs.filter(
      (blog: blogObject) => blog.tags.find((tag: string) => tag.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-') === selectedTag?.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  const handleTagSelect = (tag: string) => {
    if(selectedTag !== tag){
      history.push(`/blog/tag/${tag.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')}`)
    }
  };

  useEffect(() => {
    fetchBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedTag]);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  const changePage = (val:number = 1) => {
    setPage(val);
    scrollToTop();
  }

  const pagination = () => {
    return (
      <Pagination
        count={pageCount(filteredData)}
        page={page}
        onChange={(_event, val) => changePage(val)}
        className={classes.pagination}
      />
    );
  };

  return (
    <>
     <Metadata title={SeoJson.pages.blog.title} description={SeoJson.pages.blog.description} url={`${currentOrigin}${SeoJson.pages.blog.url}`} image={`${currentOrigin}${SeoJson.pages.blog.image}`} isPost={false} type={METADATA_TYPES.SERIES}  />
        <>
          <div className={classes.root}>
            <Container maxWidth="lg">
              <h1 className={classes.mainText}>{t("blog.title")}</h1>
            </Container>
          </div>
          <div className={classes.sectionDiv}>
            <h1 className={classes.blogTitle}>{selectedTag}</h1>
            <Grid container direction="row" className={classes.blogsWrapper} >
              {filteredData
                ? filteredData
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((elm: any) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          key={elm.id}
                          className={classes.cardSize}
                        >
                          {/* Passing parameters blog(passing complete blog object), and handleTagSelect(this fuction handles the action when tag button is clicked)  */}
                          <BlogCard blog={elm} handleTagSelect={(tag:string) => handleTagSelect(tag)}></BlogCard>
                        </Grid>
                      );
                    })
                : ""}
            </Grid>
            {pagination()}
          </div>
        </>
      <div className={classes.blogFooter}>
          {/* Sponsor section  */}
          <Sponsor />
          {/* Display footer */}
          <footer className={classes.footer}>
            <Footer />
          </footer>
      </div>
      
    </>
  );
};
export default Tag;
