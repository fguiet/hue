// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { notebookToContextJSON, notebookToJSON, snippetToContextJSON } from '../notebookSerde';
import Notebook from '../notebook';
import sessionManager from 'apps/notebook2/execution/sessionManager';

describe('notebookSerde.js', () => {
  const viewModel = {
    editorType: () => 'notebook',
    selectedNotebook: () => undefined,
    availableSnippets: () => ({}),
    editorMode: () => false,
    getSnippetViewSettings: () => ({ sqlDialect: true })
  };

  window.HUE_CHARTS = {
    TYPES: {
      BARCHART: 'barchart'
    }
  };

  beforeEach(() => {
    spyOn(sessionManager, 'getSession').and.callFake(() => Promise.resolve());
  });

  it('should serialize a notebook to JSON', async () => {
    const notebook = new Notebook(viewModel, {});
    notebook.addSnippet({ type: 'hive' });
    notebook.addSnippet({ type: 'impala' });

    const notebookJSON = notebookToJSON(notebook);

    const notebookRaw = JSON.parse(notebookJSON);

    expect(notebookRaw.snippets.length).toEqual(2);
    expect(notebookRaw.snippets[0].type).toEqual('hive');
    expect(notebookRaw.snippets[1].type).toEqual('impala');
  });

  it('should serialize a notebook context to JSON', async () => {
    const notebook = new Notebook(viewModel, {});
    notebook.addSnippet({ type: 'hive' });

    const notebookContextJSON = notebookToContextJSON(notebook);

    const notebookContextRaw = JSON.parse(notebookContextJSON);

    expect(notebookContextRaw.id).toEqual(notebook.id());
  });

  it('should serialize a snippet context to JSON', async () => {
    const notebook = new Notebook(viewModel, {});
    const snippet = notebook.addSnippet({ type: 'hive' });

    const snippetContextJSON = snippetToContextJSON(snippet);

    const snippetContextRaw = JSON.parse(snippetContextJSON);

    expect(snippetContextRaw.id).toEqual(snippet.id());
    expect(snippetContextRaw.type).toEqual('hive');
  });
});
