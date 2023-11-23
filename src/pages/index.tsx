import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

const HomePage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className='text-red-500'>
      <Modal opened={opened} onClose={close} title='Authentication'>
        <p>Modal content</p>
      </Modal>

      <Button onClick={open}>Open modal</Button>
    </div>
  );
};

export default HomePage;
