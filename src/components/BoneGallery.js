import React, {  useMemo, useState } from 'react';
import { Modal, Tabs, Image, Typography, Flex } from 'antd';
import { ImageGrid } from './ImageGrid';
import { KonvaImage } from './KonvaImage';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

export const TabValues = {
    ALL_GROUPS: {
        label: 'All Groups',
        value: 'all_groups',
    },
    TRAIN: {
        label: 'Train',
        value: 'train',
    },
    TEST: {
        label: 'Test',
        value: 'test',
    },
    VALUE: {
        label: 'Value',
        value: 'value',
    },   
}

export const BoneGallery = ({ onTabChange, images, isLoading }) => {
    const [selectedImage, setSelectedImage] = useState(null)

    const imageNode = useMemo(() => {
            return (<>
                { isLoading 
                    ? <p>Loading...</p> 
                    : <ImageGrid onClick={(url) => setSelectedImage(url)} images={images ?? []} />
                }
            </>)
    }, [isLoading, images])


    const handleTabChange = (key) => {
        onTabChange(key);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    }

    return (
        <>
            <Modal className="image-modal" width="70%" open={!!selectedImage} footer={null} onCancel={closeImageModal}>
                {selectedImage && (
                    <Flex vertical gap={10} align="flex-start" style={{ display: 'inline-flex' }}>
                        <Paragraph>{selectedImage.photoName}</Paragraph>
                        <KonvaImage image={selectedImage} />
                    </Flex>
                )}
            </Modal>
            <Tabs defaultActiveKey="all_groups" onChange={handleTabChange}>
                <TabPane tab={TabValues.ALL_GROUPS.label} key={TabValues.ALL_GROUPS.value}>
                    {imageNode}
                </TabPane>
                <TabPane tab={TabValues.TRAIN.label} key={TabValues.TRAIN.value}>
                    {imageNode}
                </TabPane>
                <TabPane tab={TabValues.VALUE.label} key={TabValues.VALUE.value}>
                    {imageNode}
                </TabPane>
                <TabPane tab={TabValues.TEST.label} key={TabValues.TEST.value}>
                    {imageNode}
                </TabPane>
            </Tabs>
        </>
    )
}