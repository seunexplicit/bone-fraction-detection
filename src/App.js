import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Layout, Typography, Image, Pagination } from 'antd';
import './App.css';
import { Colors } from './constants/colors';
import { ChipFilter } from './components/ChipFilter';
import { RangeFilter } from './components/RangeFIlter';
import { BoneGallery, TabValues } from './components/BoneGallery';
import { fetchS3Albums } from './utilities/fetchS3Images';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const classFilterValues = [
  { value: 'Elbow positive', color: Colors.BLUE },
  { value: 'Fingers positive', color: Colors.GOLDENYELLOW },
  { value: 'Forearm fracture', color: Colors.SEA },
  { value: 'Humerus', color: Colors.LIME },
  { value: 'Humerus fracture', color: Colors.ORANGE },
  { value: 'Shoulder fracture', color: Colors.PURPLE },
  { value: 'Wrist positive', color: Colors.RED },
]

const PAGE_SIZE = 50

function App() {
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState([]);
  const [{ allImages, displayedImages }, setImageMetadata] = useState({ allImages: [], displayedImages: []});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(TabValues.ALL_GROUPS.value);

  useEffect(() => {
      if (currentTab === TabValues.ALL_GROUPS.value) {
        const allImages = [...(folders.value ?? []), ...(folders.train ?? []), ...(folders.test ?? [])]
        setImageMetadata(() => ({ allImages, displayedImages: allImages}))
      } else {
        const activeTabImages = folders[currentTab]
        setImageMetadata(() => ({ allImages, displayedImages: activeTabImages}))
      }

      setCurrentPage(1)
  }, [folders, currentTab])

  const paginatedImages = useMemo(() => {
    return displayedImages?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) ?? []
  }, [displayedImages, currentPage])

  const fetchAlbums = async () => {
    setLoading(true);
    const albums = await fetchS3Albums()
    setFolders(albums?.[0]?.folders)
    setLoading(false);
  }

  useEffect(() => {
    fetchAlbums();
    alert('Spent 7 hours working on it.')
  }, [])

  return (
    <Layout style={{ padding: '25px 32px'}}>
      <Sider width={330} className="sider">
        <Image src='/images/Logo.svg' preview={false} style={{ objectFit: 'contain' }}/>
        <Title level={5} style={{ marginBottom: 4 }}>Classes Filter</Title>
        <ChipFilter chipValues={classFilterValues} />
        <Title level={5}>Polygon Range</Title>
        <RangeFilter min={0} max={4} defaultValue={[0,4]}/>
      </Sider>
      <Content className="content">
        <Flex justify="space-between" align="center" style={{ marginBottom: 26 }}>
          <Title style={{ margin: 0 }} level={3}>Bone-Fraction-Detection</Title>
          <Paragraph style={{ fontSize: 18, margin: 0 }}>
            <Text className='semi-bold'>{paginatedImages.length}</Text> of 
            {' '}<Text className='semi-bold'>{displayedImages.length}</Text> images
          </Paragraph>
        </Flex>
        <BoneGallery 
          images={paginatedImages} 
          isLoading={loading}
          onTabChange={(tab) => setCurrentTab(tab)}
        />
        <Flex justify="center" style={{ marginTop: 10 }}>
          <Pagination 
            size="small" 
            pageSize={PAGE_SIZE} 
            current={currentPage} 
            onChange={(page) => setCurrentPage(page)} 
            total={displayedImages.length} 
          />
        </Flex>
      </Content>
    </Layout>
  );
}

export default App