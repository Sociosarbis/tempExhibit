import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useContext,
  SyntheticEvent,
  forwardRef,
  MutableRefObject,
  useReducer,
} from 'react';
import Hls from 'hls.js';
import PlayList from '../components/PlayList';
import { useListDialog } from '../components/ListDialog';
import { WorkDetail } from '../components/WorkDetail';
import WorkItem from '../components/WorkItem';
import { FindWorksResponse, HistoryItem, Work } from '../apis/work';
import { Grid, makeStyles } from '@material-ui/core';
import { GlobalContext, GlobalContextValue } from '../contexts';
import { PlayerContext, Player } from '../hooks/usePlayer';
import { DBContext } from '../contexts/db';
import { omit } from '../utils/obj';
import { useApolloClient } from 'react-apollo';
import { useLocation } from 'react-router-dom';
import { gql } from 'apollo-boost';
import cls from 'classnames';
import { useBaseStyles } from '../styles/base';

const urlRegExp = /([a-zA-Z0-9]+:)?\/*?([^#?/:]+)(:\d+)?([^:#?]*?)(\?[^#]*)?(#.*)?$/;

const useStyles = makeStyles(() => ({
  page: {
    padding: '10px 10px 60px 10px',
  },
  padding: {
    paddingTop: '64px',
  },
  search: {
    position: 'absolute',
    padding: '10px',
    left: 0,
    top: 0,
    boxSizing: 'border-box',
    width: '100%',
  },
}));

type SearchRef = {
  setInputValue: (value: string) => any;
  inputValue: string;
  changeOffset: (change: number) => any;
};

const Search = forwardRef<
  SearchRef,
  {
    onConfirm: (value: string) => any;
    children: React.ReactNode;
    onChangeHeight: (height: number) => any;
  }
>(({ onConfirm, children, onChangeHeight }, ref) => {
  const classes = useStyles({});
  const baseClasses = useBaseStyles({});
  const rootRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef<number>(0);
  useEffect(() => {
    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const e of entries) {
        heightRef.current = (e.target as HTMLElement).offsetHeight;
        onChangeHeight(heightRef.current);
      }
    });
    if (rootRef.current) {
      observer.observe(rootRef.current);
      heightRef.current = rootRef.current.offsetHeight;
      onChangeHeight(heightRef.current);
    }
    return () => observer.disconnect();
  }, [rootRef, heightRef, onChangeHeight]);
  const [offset, changeOffset] = useReducer(
    (state: number, delta: number): number => {
      return Math.max(Math.min(0, state + delta), -74);
    },
    0,
  );
  const [inputValue, setInputValue] = useState('');
  (ref as MutableRefObject<SearchRef>).current = {
    setInputValue,
    inputValue,
    changeOffset,
  };
  return (
    <div
      ref={rootRef}
      className={cls([
        baseClasses.smallTransition,
        'bg-canvas',
        classes.search,
      ])}
      style={{
        transform: `perspective(1px) translate3d(0, ${offset}px, 0)`,
      }}
    >
      <input
        className="w-full mb-2 bg-black input"
        id="url-input"
        placeholder="影片名称"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="mb-2">
        <input
          id="replace-video-button"
          className="mr-1 btn"
          type="button"
          value="搜索影片"
          onClick={() => onConfirm(inputValue)}
        />
      </div>
      {children}
    </div>
  );
});

function Home() {
  const classes = useStyles({});
  const [workList, setWorkList] = useState<FindWorksResponse>([]);
  const player = useContext(PlayerContext) as Player;
  const db = useContext(DBContext);
  const location = useLocation<any>();
  const searchRef = useRef<SearchRef>(null);
  const { setOpen, ListDialog } = useListDialog();
  const { showMessage, withLoading } = useContext(
    GlobalContext,
  ) as GlobalContextValue;
  const onSelectPlayList = useCallback(
    async (item: FindWorksResponse[0]) => {
      if (searchRef.current) {
        item.keywords = searchRef.current.inputValue;
      }
      await player.selectPlayList(item);
      setOpen(false);
    },
    [setOpen, player, searchRef],
  );

  const client = useApolloClient();

  const hlsRef = useRef<Hls | null>(null);

  const playerRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = useCallback(
    (url: string) => {
      const playerEl = playerRef.current as HTMLVideoElement;
      const hls = hlsRef.current as Hls;
      const match = url.trim().match(urlRegExp);
      hls.detachMedia();
      if (match) {
        let url = match[0];
        if (match[1] === 'http:') {
          url = url.replace(/^http:/, 'https:');
        }
        player.setVideoUrl(url);
        if (player.work) {
          const chap = player.work.playList.find((item) => item.url === url);
          if (chap) {
            db.set<Omit<Work, 'playList'>>(
              'work',
              String(player.work.id),
              omit(player.work, ['playList']),
            ).then(() =>
              db.set<HistoryItem>('history', url, {
                url,
                utime: Math.floor(new Date().valueOf() / 1000),
                chap: chap.name,
                id: (player.work as Work).id,
              }),
            );
          }
        }
        if (/\.m3u8/.test(url)) {
          hls.attachMedia(playerEl);
          hls.loadSource(url);
        } else {
          playerEl.setAttribute('src', url);
          playerEl.play();
        }
      }
    },
    [player, db],
  );

  player.controller.current = {
    handlePlay,
  };

  useEffect(() => {
    const hls = new Hls();
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      (playerRef.current as HTMLVideoElement).play();
    });
    hlsRef.current = hls;
  }, []);

  const onConfirmSearch = useCallback(
    async (value: string) => {
      if (!value.trim()) return showMessage('影片名称不可为空');
      const {
        data: { works: res },
      } = await withLoading(
        client.query<{ works: Work[] }>({
          query: gql`
            query FindWorks($keyword: String!) {
              works(keyword: $keyword) {
                name
                cate
                tag
                utime
                id
              }
            }
          `,
          variables: {
            keyword: value,
          },
        }),
      );
      setWorkList(res);
      setOpen(true);
    },
    [setOpen, setWorkList, client, withLoading, showMessage],
  );

  const [padding, setPadding] = useState(74);

  const scrollRef = useRef<number>(0);

  const onScroll = useCallback((e: SyntheticEvent) => {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    const diff = scrollRef.current - scrollTop;
    if (searchRef.current) {
      searchRef.current.changeOffset(diff);
    }
    scrollRef.current = scrollTop;
  }, []);

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = new URLSearchParams(location.search).get('search');
    if (text) {
      if (searchRef.current) {
        searchRef.current.setInputValue(text);
      }
    }
  }, [location.search, searchRef]);

  return (
    <Grid
      container
      direction="column"
      classes={{
        root: classes.page,
      }}
      className="bottom-navigation-page"
    >
      <Grid
        item
        component="div"
        className={cls('overflow-auto', 'flex-1')}
        onScroll={onScroll}
        style={{ paddingTop: `${padding}px` }}
        ref={container}
      >
        {player.work ? (
          <>
            <WorkDetail
              poster={player.work.image}
              name={player.work.name}
              keywords={player.work.keywords}
            />
            <PlayList
              currentUrl={player.videoUrl}
              work={player.work}
              onSelect={handlePlay}
            />
          </>
        ) : null}
      </Grid>
      <Search
        onConfirm={onConfirmSearch}
        ref={searchRef}
        onChangeHeight={setPadding}
      >
        <div className="text-center mb-2">
          <video
            className="w-full"
            id="player"
            ref={playerRef}
            controls={true}
            crossOrigin="anonymous"
          ></video>
        </div>
      </Search>
      <ListDialog
        list={workList}
        title="搜索结果"
        renderItem={WorkItem}
        onItemClick={onSelectPlayList}
      />
    </Grid>
  );
}

export default Home;
