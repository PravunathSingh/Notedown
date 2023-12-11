import { ActionIcon, Menu, TextInput, Tooltip, rem } from '@mantine/core';
import { Octokit } from '@octokit/rest';
import { IconMoodSmile, IconSearch } from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
export interface EmojiDropdownProps {
  onSelectEmoji: (emoji: { name: string; url: string }) => void;
}

const EmojiDropdown: React.FC<EmojiDropdownProps> = ({ onSelectEmoji }) => {
  const [emojis, setEmojis] = React.useState<
    | {
        name: string;
        url: string;
      }[]
    | undefined
  >(undefined);

  const [filteredEmojis, setFilteredEmojis] = React.useState<
    | {
        name: string;
        url: string;
      }[]
    | undefined
  >(undefined);

  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    const getOctokit = async () => {
      const octokit = new Octokit();
      const res = await octokit.rest.emojis.get();
      const emojis = res.data;

      // emojis is an object with key as emoji name and value as url. We need to convert it to an array of objects with key as name and value as url
      const emojisArray = Object.keys(emojis).map((key) => {
        return {
          name: key,
          url: emojis[key],
        };
      });

      setEmojis(emojisArray);
    };
    getOctokit();
  }, []);

  React.useEffect(() => {
    if (emojis) {
      const filteredEmojis = emojis.filter((emoji) =>
        emoji.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEmojis(filteredEmojis);
    } else {
      setFilteredEmojis(emojis);
    }
  }, [searchText, emojis]);

  return (
    <Menu
      // closeOnItemClick={true}
      onClose={() => {
        setSearchText('');
        setFilteredEmojis(emojis);
      }}
      width={280}
    >
      <Menu.Target>
        <Tooltip position='left' label='Emoji'>
          <ActionIcon variant='subtle' color='gray'>
            <IconMoodSmile style={{ width: rem(18) }} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <TextInput
          placeholder='Search...'
          className='mb-3'
          leftSection={<IconSearch style={{ width: rem(14) }} />}
          size='xs'
          value={searchText}
          onChange={(event) => {
            setSearchText(event.currentTarget.value);
          }}
        />

        <Menu.Item>
          <VirtuosoGrid
            style={{ height: 200 }}
            data={filteredEmojis || []}
            totalCount={filteredEmojis?.length || 0}
            overscan={10}
            itemContent={(index) => {
              const emoji = filteredEmojis?.[index];
              return (
                <Tooltip
                  key={emoji?.name}
                  label={emoji?.name}
                  withArrow
                  position='bottom'
                >
                  <ActionIcon
                    variant='subtle'
                    color='gray'
                    onClick={() => onSelectEmoji(emoji!)}
                  >
                    <Image
                      src={emoji?.url as string}
                      alt={emoji?.name as string}
                      width={20}
                      height={20}
                    />
                  </ActionIcon>
                </Tooltip>
              );
            }}
            listClassName='grid grid-cols-5 gap-2'
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default EmojiDropdown;
