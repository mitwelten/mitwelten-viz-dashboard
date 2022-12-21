// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState, useRef } from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import {
  usePopupState,
  bindToggle,
  bindPopper,
} from 'material-ui-popup-state/hooks';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InfoPanelContent from '../components/panels/info/InfoPanelContent';
import InfoPanelHeader from '../components/panels/info/InfoPanelHeader';
import styles from './InfoPanelContainer.module.scss';
import Fab from '@mui/material/Fab';
import { Modal } from '@mui/material';

const InfoPanelContainer = ({ collapseGallery, open }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <>
      <Modal
        open={open}
        onBackdropClick={() => collapseGallery()}
        placement="bottom"
      >
        <Paper sx={{ ...style, width: '50%', zIndex: 999 }}>
          <InfoPanelHeader onIconClick={() => collapseGallery()}>
            Mitwelten
          </InfoPanelHeader>
          <InfoPanelContent>
            <h5 style={{ color: 'rgb(44, 48, 59)', marginTop: 0 }}>
              Wie können mediale Designin­terventionen auf Grundlage des
              Internets der Dinge ökologisch und kulturell zur Förderung von
              Biodiversität in lokalen Ökosystemen beitragen?
            </h5>
            <p>
              Zur Beantwortung dieser Leitfrage werden in drei Fallstudien in
              Mensch-Umwelt-Aushandlungs­prozessen medien­technologische
              Infrastrukturen gestaltet und installiert: in der Kulturlandschaft
              der Merian Gärten bei Basel, in einem ehemaligen Hafengebiet der
              Stadt Basel und in einem Naturschutzgebiet in der Agglomeration
              Basels.
            </p>
            <p>
              Die Design­interventionen haben zum Ziel, Pflanzen und Tieren eine
              Stimme zu geben, ökologische Wissensbestände und Erfahrungen zu
              erweitern, neue Formen Spezies übergreifenden Zusammenlebens zu
              gestalten und dadurch ökologische Werte und Verhaltensweisen zu
              kultivieren. Dazu wird ein{' '}
              <a href="https://github.com/mitwelten">
                Internet of Things Toolkit
              </a>{' '}
              entwickelt, das im Rahmen der gestalterischen Interventionen als
              medientechnologische Infrastruktur dient.
            </p>

            <h3>Interdisziplinäres Designforschungsprojekt</h3>
            <ul>
              <li>Projektdauer: 2020-2024</li>
              <li>Förderstelle: Schweizerischer Nationalfonds (SNF)</li>
              <li>
                Forschungseinrichtungen: Fachhochschule Nordwestschweiz –
                Hochschule für Gestaltung und Kunst und Technische Hochschule,
                mit SWILD – Stadtökologie Wildtierforschung Kommunikation
                (non-profit Forschungs- und Beratungsgemeinschaft)
              </li>
              <li>
                Disziplinen: Designforschung, Kultur- und Medienwissenschaft,
                Ökologie, Biologie, Informatik, Siedlungsökologie und
                Environmental Humanities, Geografie, Geo-Visualisierung
              </li>
              <li>
                Kooperationspartner Fallstudien: Merian Gärten der Christoph
                Merian Stiftung; Bau- und Verkehrsdepartement Basel-Stadt,
                Städtebau &amp; Architektur, Gesamtentwicklung Basel Nord und
                Stadtgärtnerei Basel; Technische Verwaltung Reinach Umwelt +
                Energie und Aufsichtskommission der Reinacherheide
              </li>
            </ul>

            <h4>Ziel des Forschungsprojekts</h4>
            <p>
              Das Ziel des Forschungsprojekts ist es, durch kultur- und
              medienwissenschaftlich erweiterte, interdisziplinäre
              Designforschung und Technologie-Entwicklung Verfahren und Mittel
              zur Bewahrung der Artenvielfalt in Siedlungs- und
              Naherholungsgebieten zu entwickeln und öffentlich bereitzustellen.
            </p>
            <p>
              <img
                src="https://www.mitwelten.org/img/infograph.png"
                alt="Mitwelten Info Graph"
                width="100%"
              />
            </p>
            <p>
              Die Verhaltensweisen, Anforderungen und ökologischen Leistungen
              der verschiedenen lokalen Akteure – Menschen, Tiere, Pflanzen,
              Dinge und Technologien sowie Landschaftselemente und
              Infrastrukturen – werden untersucht, Zusammenhänge analysiert und
              bedarfsgerechte Gestaltungsentwürfe für geteilte Lebensräume
              entwickelt.
            </p>
            <p>
              Mit sensorbasierten Installationen wird direkt im Feld erprobt,
              wie ökologische Wissensbestände und Erfahrungen erweitert werden
              können, um Pflanzen und Tieren im gesellschaftlichen Bewusstsein
              angemessen Gehör zu verschaffen. Anpassungsfähige, an Bedarf und
              Eigenheiten der örtlichen Flora und Fauna orientierte
              Infrastrukturen ersetzen auf Industrie, Auto und ausschiesslich
              auf den Menschen bezogene Bebauungsformen und fördern ökologische
              Werte und Verhaltensweisen. Dazu wird ein Internet of Things
              Toolkit entwickelt, das im Rahmen der gestalterischen
              Interventionen als medientechnologische Infrastruktur dient. Der
              Einsatz von Technologie erfolgt aber in kritischer Abgrenzung von
              kommerziellen und technophilen ‘smarten’ Produkten und Systemen –
              so zurückhaltend und transparent wie möglich, so durchdacht und
              konsequent wie nötig.
            </p>
            <p>
              <img
                src="https://www.mitwelten.org/img/accesspoint.jpg"
                alt="Access Point"
                width="100%"
              />
              <br />
              Access Point
            </p>
            <p>
              <img
                src="https://www.mitwelten.org/img/opticalsensor.jpg"
                alt="Optischer Sensor"
                width="100%"
              />
              <br />
              Optischer Sensor
            </p>
            <p>
              <img
                src="https://www.mitwelten.org/img/audiologger.jpg"
                alt="Audio Logger"
                width="100%"
              />
              <br />
              Audio Logger
            </p>
            <p>
              <img
                src="https://www.mitwelten.org/img/isczmap.png"
                alt="Karte"
                width="84%"
              />
            </p>
            <p>
              Der Anstieg der Weltbevölkerung und globale
              Industrialisierungsprozesse führen zu Arten- und Lebensraumschwund
              (gemäss Forum Biodiversität Schweiz). Menschliche Siedlungsräume
              können Wildtieren mittlerweile attraktivere Lebensgrundlagen als
              die Agrarwüsten der industriellen Landwirtschaft bieten, wodurch
              es zu Konflikten kommt. Bisher werden Grünanlagen in der
              Siedlungsgestaltung auf den Menschen ausgerichtet, während der
              Mensch aus der Naturschutzbiologie ausgeschlossen wird. Der
              vermeintliche Widerspruch von Natur und Technologie muss in ein
              konstruktives Zusammenspiel transformiert werden, damit die
              Bewahrung der Artenvielfalt gelingen kann. Das diverse
              Forschungsgebiet der Medienökologie bietet einen theoretischen
              Rahmen, um dieses Spannungsfeld systematisch zu untersuchen und
              produktive Gestaltungsansätze zu entwickeln. Das Forschungsprojekt
              trägt auf diese Weise zur anwendungsorientierten und
              gesellschaftlich engagierten interdisziplinären Zusammenarbeit
              bei.
            </p>
          </InfoPanelContent>
        </Paper>
      </Modal>
    </>
  );
};

InfoPanelContainer.propTypes = {
  collapseGallery: PropTypes.func,
  open: PropTypes.open,
};

export default InfoPanelContainer;
