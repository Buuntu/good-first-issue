import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

import './App.css';

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    minHeight: '50vh',
  },
  button: {
    height: '100%',
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
  title: string;
  labels: string;
};

const App = () => {
  const classes = useStyles();
  const { handleSubmit, register, getValues } = useForm();
  const [results, setResults] = useState<GithubIssueType[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const searchGithub = async (searchString: string) => {
      try {
        const data = await fetch(
          `https://api.github.com/search/issues?q=${searchString}`,
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

    if (isFetching && getValues('search')) {
      searchGithub(getValues('search'));
    }
  }, [isFetching]);

  return (
    <div className="App">
      <header className="App-header">
        <Grid container justify="center">
          <Paper className={classes.card}>
            <form
              noValidate
              onSubmit={handleSubmit((data) => setIsFetching(true))}
            >
              <Grid container>
                <Grid item xs={8}>
                  <TextField
                    inputRef={register}
                    required
                    name="search"
                    variant="outlined"
                    label="Search GitHub"
                  ></TextField>
                </Grid>
                <Grid item xs={4}>
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
            <Grid container>{isFetching ? <CircularProgress /> : null}</Grid>
          </Paper>
        </Grid>
      </header>
    </div>
  );
};

export default App;
