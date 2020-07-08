import React, { useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import GitHubButton from 'react-github-btn';

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

type GithubIssueType = {
  url: string;
  repository_url: string;
  html_url: string;
  title: string;
  labels: string;
};

const App = () => {
  const classes = useStyles();
  const { handleSubmit, register } = useForm();
  const [results, setResults] = useState<GithubIssueType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const searchGithub = async (searchString: string) => {
    setIsFetching(true);
    try {
      const data = await fetch(
        `https://api.github.com/search/issues?q=${searchString}+label:"good first issue"+is:"open"`,
      );

      if (data.ok) {
        const json = await data.json();
        console.log(json);
        setResults(json.items);
      }
    } catch (err) {
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
            <Grid item xs={12} alignContent="center">
              <Typography
                className={classes.header}
                variant="h2"
                align="center"
              >
                good first issue
              </Typography>
            </Grid>
            <Grid item xs={12} alignContent="center">
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
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Url</TableCell>
                            <TableCell>Repository URL</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.map((item) => (
                            <TableRow>
                              <TableCell>{item.title}</TableCell>
                              <TableCell>
                                <a href={item.html_url}>{item.html_url}</a>
                              </TableCell>
                              <TableCell>
                                <a href={item.repository_url}>
                                  {item.repository_url}
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>
                  ) : (
                    'No Results'
                  )}
                </>
              )}
            </Grid>
          </Paper>
        </Grid>
      </header>
    </div>
  );
};

export default App;
