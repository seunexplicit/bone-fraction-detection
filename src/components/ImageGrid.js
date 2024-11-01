import { Image, Card, Row, Col, Typography } from 'antd';

const { Text } = Typography

export const ImageGrid = ({ images, onClick }) => (
    <Row gutter={[32, 32]}>
      {images.map((image) => (
        <Col key={image.photoUrl} xs={12} sm={8} md={6} lg={4} xxl={3}>
            <Card
                hoverable
                onClick={() => onClick(image)}
                cover={<Image src={image.thumbnailUrl} preview={false} />}
                style={{ boxShadow: 'none' }}
            >
                <Text ellipsis={{ tooltip: image.photoName }}>{image.photoName}</Text>
            </Card>
        </Col>
      ))}
    </Row>
  );
  