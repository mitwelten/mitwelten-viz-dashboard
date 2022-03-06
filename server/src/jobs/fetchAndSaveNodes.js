// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../dataAccessors/httpAccessor';
import saveNodes from '../useCases/saveNodes';

const fetchAndSaveNodes = () => {
  const accessor = httpsAccessor();

  saveNodes(accessor);
};

export default fetchAndSaveNodes;
