import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '간단한 기록부터',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        매일 진행한 내용을 간단하게나마 기록을 합니다.
      </>
    ),
  },
  {
    title: '우당탕탕',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        성공한 내역과 실패한 내역을 모두 기록합니다.
      </>
    ),
  },
  {
    title: '꾸준하게 작성하기',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        꾸준하게 기록합니다.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
