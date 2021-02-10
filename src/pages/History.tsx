import React, { useContext, useState } from 'react';
import cls from 'classnames';
import { useHistory } from 'react-router-dom';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  Card,
  CardMedia,
  makeStyles,
} from '@material-ui/core';
import { useBaseStyles } from '../styles/base';
import { DBContext } from '../contexts/db';
import { FindWorksResponse } from '../apis/work';
import { PlayerContext, Player } from '../hooks/usePlayer';
import useMount from '../hooks/useMount';

const useStyles = makeStyles(() => ({
  workImage: {
    width: '75px',
    height: '100px',
  },
}));

export type HistoryItem = {
  url: string;
  chap: string;
  utime: number;
  work: FindWorksResponse[0] & { image: string };
};

export default function History() {
  const baseClasses = useBaseStyles({});
  const player = useContext(PlayerContext) as Player;
  const classes = useStyles({});
  const db = useContext(DBContext);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const history = useHistory<any>();
  useMount(
    {
      setItems,
      db,
    },
    async ({ setItems, db }) => {
      const items = await db.getRange('history', 0, 10, {
        index: 'utime',
        order: 'prev',
      });
      setItems(items);
    },
  );
  return (
    <div className="bottom-navigation-page">
      <Paper square classes={{ root: cls(baseClasses.container, 'h-full') }}>
        <Grid container direction="column" wrap="nowrap" className="h-full">
          <Typography variant="h6" classes={{ root: baseClasses.row }}>
            播放历史
          </Typography>
          <List
            className="h-full overflow-auto"
            classes={{ root: baseClasses.primary }}
          >
            {items.map((item, i) => {
              return (
                <ListItem
                  button
                  divider
                  key={i}
                  onClick={async () => {
                    await player.selectPlayList(item.work);
                    player.controller.current &&
                      player.controller.current.handlePlay(item.url);
                    history.replace('/');
                  }}
                >
                  <Card className="mr-2">
                    <CardMedia
                      classes={{ root: classes.workImage }}
                      image={item.work.image}
                    ></CardMedia>
                  </Card>
                  <ListItemText
                    primary={item.work.name}
                    secondary={item.chap}
                  ></ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Paper>
    </div>
  );
}