import React, { useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
  Typography,
  Chip,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import MaterialTable from 'material-table';
import GitHubButton from 'react-github-btn';

import { tableIcons } from './table';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    minHeight: '50vh',
    minWidth: '20%',
  },
  button: {
    marginLeft: theme.spacing(1),
    height: '100%',
  },
  app: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
  header: {
    fontFamily: 'Helvetica, Arial, Sans-Serif',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(10),
    backgroundColor: '#9400D3',
    width: '480px',
    borderRadius: '40px',
  },
}));

type GithubResponseType = {
  total_count: number;
  items: GithubIssueType[];
  incomplete_result: boolean;
};

type GithubLabelType = {
  name: string;
  description: string;
};

type GithubIssueType = {
  url: string;
  repository_url: string;
  html_url: string;
  title: string;
  labels: GithubLabelType[];
  assignee: string | null;
  comments: string[];
  body: string;
  created_at: string;
};

const App = () => {
  const classes = useStyles();
  const { handleSubmit, register } = useForm();
  const [results, setResults] = useState<GithubIssueType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const getRepoFromUrl = (url: string) => {
    const regex = /\/repos\/(([^/]+)\/([^/]+))/;
    const found = url.match(regex);

    return found ? found[1] : url;
  };

  const buildSearchString = (query: string): string => {
    return `https://api.github.com/search/issues?q=${query}+label:"good first issue"+is:"open"`;
  };

  const searchGithub = async (searchString: string) => {
    setIsFetching(true);
    try {
      const data = await fetch(buildSearchString(searchString));

      if (data.ok) {
        const json = await data.json();
        console.log(json);
        setResults(json.items);
      }
    } catch (err) {
      alert('There was an error on the server');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="App">
      <header className={classes.app}>
        <Grid container justify="center" alignItems="center">
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Grid item xs={12}>
              <Typography
                className={classes.header}
                variant="h2"
                align="center"
              >
                good first issue
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <GitHubButton
                href="https://github.com/Buuntu/good-first-issue"
                data-color-scheme="no-preference: light; light: light; dark: dark;"
                data-size="large"
                data-show-count
                aria-label="Star Buuntu/good-first-issue on GitHub"
              >
                Star
              </GitHubButton>
            </Grid>
          </Grid>
          <Grid item xs={12} md={8} lg={6}>
            <Paper className={classes.card}>
              <form
                noValidate
                onSubmit={handleSubmit((data) => searchGithub(data.search))}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      inputRef={register}
                      required
                      name="search"
                      variant="outlined"
                      size="small"
                      label="Search GitHub"
                    ></TextField>
                    <Button
                      type="submit"
                      variant="outlined"
                      className={classes.button}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
              <Grid container>
                {isFetching ? (
                  <CircularProgress />
                ) : (
                  <>
                    {results.length > 0 ? (
                      <Grid item xs={12}>
                        <MaterialTable
                          title={''}
                          options={{
                            padding: 'dense',
                            rowStyle: {
                              fontSize: '14px',
                            },
                          }}
                          icons={tableIcons}
                          columns={[
                            {
                              title: 'Title',
                              field: 'title',
                              render: (rowData) => (
                                <a href={rowData.html_url} target="_blank">
                                  {rowData.title}
                                </a>
                              ),
                            },

                            {
                              title: 'Labels',
                              field: 'labels',
                              render: (rowData) =>
                                rowData.labels.map((label) => (
                                  <Chip label={label.name} />
                                )),
                            },
                            {
                              title: 'Repo',
                              field: 'repository_url',
                              render: (rowData) => {
                                const repo = getRepoFromUrl(
                                  rowData.repository_url,
                                );

                                return (
                                  <a
                                    href={`https://github.com/${repo}`}
                                    target="_blank"
                                  >
                                    {repo}
                                  </a>
                                );
                              },
                            },
                            {
                              title: 'Date Created',
                              field: 'created_at',
                              defaultSort: 'desc',
                              render: (rowData) =>
                                new Date(rowData.created_at).toDateString(),
                            },
                          ]}
                          data={results}
                        />
                      </Grid>
                    ) : (
                      'No Results'
                    )}
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </header>
    </div>
  );
};

export default App;
